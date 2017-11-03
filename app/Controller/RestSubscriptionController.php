<?php
  App::uses('Controller', 'Controller');
  App::uses('Paypal', 'Paypal.Lib');

  class RestSubscriptionController extends Controller {
    public $components = array(
      'Rest',
      'Notification'
    );
    public $uses = array(
      'User',
      'UserProp',
      'Country',
      'AppSetting',
      'SubscriptionLog',
      'SubscriptionCoupon',
      'SubscriptionPackage',
      'SubscriptionPayment',
      'SubscriptionPaymentLost',
      'SubscriptionPaymentBilling'
    );

    public function beforeFilter() {
      $paypalConfig = array(
        'sandboxMode' => $this->AppSetting->getBoolean("Paypal.sandbox"),
        'nvpUsername' => $this->AppSetting->getValue('Paypal.username'),
        'nvpPassword' => $this->AppSetting->getValue('Paypal.password'),
        'nvpSignature' => $this->AppSetting->getValue('Paypal.signature')
      );
      $this->paypalConfig = $paypalConfig;
      $this->Paypal = new Paypal($paypalConfig);
    }

    public function printInvoice($token, $id) {
      $this->User->recursive = 2;
      $user = $this->User->findByToken($token);
      if (!isset($user['User'])) {
        throw new NotFoundException();
      }
      $payment = $this->SubscriptionPayment->get($id, $user);
      if (!isset($payment['SubscriptionPayment'])) {
        throw new NotFoundException();
      }
      $owner = $this->User->findById($payment['SubscriptionPayment']['user_id']);
      $package = $this->SubscriptionPackage->getByPayment($payment);
      $this->set('payment', $payment['SubscriptionPayment']);
      $this->set('package', $package['SubscriptionPackage']);
      $this->set('user', $owner);
      $this->response->type('text/html');
      $this->render('/Subscription/invoice');
    }

    public function buyPackage() {
      if(!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $this->Rest->debug();
      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Not authorized."));
      }
      $package = $this->SubscriptionPackage->getActive($request['id']);
      if (is_null($package)) {
        return $this->Rest->error(__("Package not found."));
      }
      $coupon = null;
      if (isset($request['coupon'])) {
        $coupon = $this->SubscriptionCoupon->findByCouponCode($request['coupon']);
        if (isset($coupon['SubscriptionCoupon'])) {
          $coupon = $coupon['SubscriptionCoupon'];
        }
      }
      $order = $this->SubscriptionPayment->createOrder($package, $user, $coupon);
      try {
        $redirect = $this->Paypal->setExpressCheckout($order);
        return $this->Rest->json(array(
          'error' => false,
          'config' => $this->paypalConfig,
          'redirect' => $redirect
        ));
      }
      catch(Exception $e) {
        return $this->Rest->error($e->getMessage());
      }
    }

    public function getStatus() {
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      $pending = $this->SubscriptionPayment->find('count', array(
        'conditions' => array(
          'user_id' => $user['User']['id'],
          'status' => 'Pending'
        )
      ));
      $expiry = new DateTime($user['User']['expiry_date']);
      $today = new DateTime();
      $days = (int)$today->diff($expiry)->format('%r%a');
      if ($pending > 0) {
        $status = 'pending';
      }
      else if ($days > 15) {
        $status = 'active';
      }
      else if ($days >= 0) {
        $status = 'expiring';
      }
      else {
        $status = 'expired';
      }

      return $this->Rest->ok(array(
        'status' => $status,
        'expiry' => $expiry,
        'days' => $days
      ));
    }

    public function createPayment() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($request['token'])) {
        return $this->Rest->error(__("Not allowed."));
      }

      try {
        $this->SubscriptionLog->setPrefix("createPayment");
        $this->SubscriptionPayment->begin();
        $payment = $this->SubscriptionPayment->findByPaypalToken($request['paypal_token']);
        if (isset($payment) && isset($payment['SubscriptionPayment'])) {
          throw new Exception("Payment already processed.");
        }
        $response = $this->Paypal->getExpressCheckoutDetails($request['paypal_token']);
        $this->SubscriptionLog->verbose("Paypal response: " . json_encode($response));
        $packageId = $response['CUSTOM'];
        $payerId = $response['PAYERID'];
        $package = $this->SubscriptionPackage->findById($packageId);
        $package = $package['SubscriptionPackage'];
        $coupon = null;
        $firstCouponPayment = false;
        $cancelDiscount = false;
        $couponId = null;
        $amount = $package['amount'];
        if (!empty($request['coupon'])) {
          $this->SubscriptionLog->verbose("Loading coupon: " . $request['coupon']);
          $coupon = $this->SubscriptionCoupon->findByCouponCode($request['coupon']);
          if (isset($coupon['SubscriptionCoupon'])) {
            $this->SubscriptionLog->verbose("Coupon found, calculating payment details.");
            $coupon = $coupon['SubscriptionCoupon'];
            $couponId = $coupon['id'];
            $conditions = array();
            $conditions[] = array('subscription_coupon_id' => $coupon['id']);
            $conditions[] = array('user_id' => $user['User']['id']);
            $amount = $amount - $coupon['discount'];
            $count = $this->SubscriptionPayment->find('count', array('conditions' => $conditions));
            $firstCouponPayment = $count == 0;
            $cancelDiscount = $coupon['max_payments'] > 0 && $count == $coupon['max_payments'];
            $this->SubscriptionLog->verbose("Amount to pay: $amount");
            $this->SubscriptionLog->verbose("First coupon payment: " . ($firstCouponPayment ? "yes" : "no"));
            $this->SubscriptionLog->verbose("Cancel discount " . ($cancelDiscount ? "yes" : "no"));
          }
          else {
            $this->SubscriptionLog->verbose("Coupon not found.");
          }
        }
        else {
          $this->SubscriptionLog->verbose("No coupon specified.");
        }

        $order = $this->SubscriptionPayment->createOrder($package, $user, $coupon);

        $expiryDate = $this->SubscriptionPackage->calculateNextBillingDate($package, $user);
        // The billing year and number are generated when user request the invoice document.
        // Until then we don't need these informations.
        $billingYear = date('Y');
        $billingNumber = 0; // $this->SubscriptionPaymentBilling->calculateNextNumber($billingYear);

        $message = __("Account expiration extended to %s", $expiryDate->format(__('Y-m-d')));
        $payment = array(
          'user_id' => $user['User']['id'],
          'paypal_token' => $request['paypal_token'],
          'payer_id' => $payerId,
          'post_data' => json_encode($response),
          'subscription_package_id' => $package['id'],
          'subscription_coupon_id' => $couponId,
          'payout' => $amount,
          'message' => $message,
          'status' => 'Completed',
          'billing_year' => $billingYear,
          'billing_number' => $billingNumber,
          'first_coupon_payment' => $firstCouponPayment ? 1 : 0
        );
        $this->SubscriptionLog->setPrefix("RSC: $packageId - PID: $payerId");
        $this->SubscriptionLog->verbose("getExpressCheckoutDetails response: " . json_encode($response));

        if ($package['billing_type'] == 'MerchantInitiatedBilling') {
          $response = $this->Paypal->doExpressCheckoutPayment($order, $request['paypal_token'], $payerId);
          $payment['post_data'] = json_encode($response);
        }
        else if ($package['billing_type'] == 'RecurringPayments') {
          $payerId = $response['PAYERID'];
          $frequency = $package['billing_frequency'];
          $period = strtolower($package['billing_period']);
          $date = new DateTime("+$frequency $period");
          $country = $this->Country->getCodeByUser($user, 'IT');
          $ppRequest = array(
            'token' => $request['paypal_token'],
            'payer_id' => $payerId,
            'amount' => $amount,
            'custom' => join(',', array($package['id'], $user['User']['id'])),
            'start_date' => $date->format("Y-m-d\TG:i:s\Z"),
            'desc' => $package['description_for_paypal'],
            'period' => $package['billing_period'],
            'frequency' => $package['billing_frequency'],
            'currency_code' => 'EUR',
            'country_code' => $country,
            'init_amount' => $amount,
            'init_amount_failed_action' => 'CancelOnFailure'
          );
          $response = $this->Paypal->createRecurringPaymentsProfile($ppRequest);
          $paymentCountFilters = array();
          $paymentCountFilters[] = array('profile_id' => $response['PROFILEID']);
          $paymentCount = $this->SubscriptionPayment->find('count', array(
            'conditions' => $paymentCountFilters
          ));
          if ($paymentCount > 0) {
            throw new Exception(__("Payment with this profile already created!"));
          }

          if (isset($payment['post_data']) && !is_null($payment['post_data'])) {
            $postData = json_decode($payment['post_data'], true);
            $postData = array_merge($postData, $response);
            $postData = json_encode($postData);
            $payment['post_data'] = $postData;
          }
          else {
            $payment['post_data'] = json_encode($response);
          }

          $payment['profile_id'] = $response['PROFILEID'];
        }
        else {
          throw new Exception(__('Invalid billing type for selected package!'));
        }

        $user['User']['expiry_date'] = $expiryDate->format('Y-m-d');
        $this->User->save($user);
        $this->UserProp->changeProp($user, UserProp::REFERAL_STATUS, 'Acquired');

        $this->SubscriptionPayment->save($payment);
        $this->SubscriptionPayment->commit();
        $this->Notification->send(array(
          'to' => $user['User']['email'],
          'view' => "user_account_confirmed",
          'subject' => __("Payment confirmed, right now you are in SafeGuard community"),
          'vars' => array_merge($user['User'], array(
            'package' => $package,
            'payment' => $payment
          ))
        ));
        return $this->Rest->ok(__("Payment completed."));
      }
      catch(PaypalRedirectException $e) {
        return $this->Rest->error($e->getMessage());
      }
      catch(Exception $e) {
        return $this->Rest->error($e->getMessage());
      }
    }

    public function checkCoupon() {
      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if(!isset($user['User'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      if (empty($request['coupon'])) {
        return $this->Rest->error(array(
          'message' => __("Invalid coupon code."),
          'package' => $request['package']
        ));
      }
      $coupon = $this->SubscriptionCoupon->findByCouponCode($request['coupon']);
      if (!isset($coupon['SubscriptionCoupon'])) {
        return $this->Rest->error(array(
          'message' => __("Coupon not found."),
          'package' => $request['package']
        ));
      }
      $coupon = $coupon['SubscriptionCoupon'];
      $today = new DateTime();
      $expiry = new DateTime($coupon['expiry_date']);
      if ($today > $expiry) {
        return $this->Rest->error(array(
          'message' => __("Coupon expired!"),
          'package' => $request['package']
        ));
      }
      if ($coupon['max_users'] > 0) {
        $conditions = array();
        $conditions[] = array('subscription_coupon_id' => $coupon['id']);
        $conditions[] = array('first_coupon_payment' => true);
        $count = $this->SubscriptionPayment->find('count', array(
          'conditions' => $conditions
        ));
        if ($count >= $coupon['max_users']) {
          return $this->Rest->error(array(
            'message' => __("Coupon user limit reached!"),
            'package' => $request['package']
          ));
        }
      }
      if ($coupon['max_payments'] > 0) {
        $conditions = array();
        $conditions[] = array('subscription_coupon_id' => $coupon['id']);
        $conditions[] = array('user_id' => $user['User']['id']);
        $count = $this->SubscriptionPayment->find('count', array(
          'conditions' => $conditions
        ));
        if ($count >= $coupon['max_payments']) {
          return $this->Rest->error(array(
            'message' => __("Max payments per user limit reached!"),
            'package' => $request['package']
          ));
        }
      }
      return $this->Rest->ok(array(
        'message' => __("Coupon valid: you will receive %s € discount for %s recurring payments!", $coupon['discount'], $coupon['max_payments']),
        'discount' => $coupon['discount'],
        'package' => $request['package'],
        'coupon' => $request['coupon'],
        'max_payments' => $coupon['max_payments']
      ));
    }

    public function requestInvoice() {
      $request = $this->request->input('json_decode', true);
      if (!isset($request['token'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      $payment = $this->SubscriptionPayment->findById($request['id']);
      if (!isset($payment['SubscriptionPayment'])) {
        return $this->Rest->error(__("Payment not found."));
      }
      $userId = $payment['SubscriptionPayment']['user_id'];
      if ($user['User']['id'] != $userId) {
        return $this->Rest->error(__("Not authorized."));
      }
      if ($payment['SubscriptionPayment']['invoice_status'] != 'none') {
        return $this->Rest->error(__("Invoice request already executed."));
      }
      $payment['SubscriptionPayment']['invoice_status'] = 'pending';
      $this->SubscriptionPayment->save($payment);
      $packageId = $payment['SubscriptionPayment']['subscription_package_id'];
      $package = $this->SubscriptionPackage->findById($packageId);
      $this->Notification->send(array(
        'to' => $this->User->emailOf('admin'),
        'view' => "user_request_invoice",
        'subject' => __("User has requested invoice"),
        'vars' => array(
          'package' => $package['SubscriptionPackage'],
          'payment' => $payment['SubscriptionPayment'],
          'user' => $user['User']
        )
      ));
      $message = __("Invoice request sent, you will receive email when the process is completed.");
      return $this->Rest->ok($message);
    }

    public function setInvoice() {
      $this->Rest->debug();
      $request = $this->request->input('json_decode', true);
      if (!isset($request['token'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      if ($user['User']['role'] != 'admin') {
        return $this->Rest->error(__("Not authorized."));
      }
      $payment = $this->SubscriptionPayment->findById($request['id']);
      if (!isset($payment['SubscriptionPayment'])) {
        return $this->Rest->error(__("Payment not found."));
      }

      if ($payment['SubscriptionPackage']['invoice_status'] == 'completed') {
        return $this->Rest->error(__("Payment already completed!"));
      }
      $payment['SubscriptionPayment']['billing_year'] = $request['billing_year'];
      $payment['SubscriptionPayment']['billing_number'] = $request['billing_number'];
      $payment['SubscriptionPayment']['invoice_status'] = 'completed';
      $this->SubscriptionPayment->save($payment);
      $packageId = $payment['SubscriptionPayment']['subscription_package_id'];
      $package = $this->SubscriptionPackage->findById($packageId);
      $ownerId = $payment['SubscriptionPayment']['user_id'];
      $owner = $this->User->findById($ownerId);
      $this->Notification->send(array(
        'to' => $owner['User']['email'],
        'view' => "user_receive_invoice",
        'subject' => __("Invoice generated"),
        'vars' => array(
          'package' => $package['SubscriptionPackage'],
          'payment' => $payment['SubscriptionPayment'],
          'user' => $owner['User']
        )
      ));
      $message = __("Invoice updated.");
      return $this->Rest->ok($message);
    }

    /**
     * This process is used by paypal to confirm transactions.
     * @return HTTP status 200 to notify paypal that the process is completed.
     */
    public function ipn() {
      $this->autoRender = false;
      $this->layout = null;
      $generateInvoice = false;
      $transactionType = $this->request->data('txn_type');
      $payerId = $this->request->data('payer_id');
      $paymentLost = false;
      $this->SubscriptionLog->setPrefix("IPN: $transactionType - PID: $payerId");
      $this->SubscriptionLog->verbose("begin");
      $this->SubscriptionLog->verbose(json_encode($this->request->data));
      if ($transactionType == "recurring_payment") {
        $pay = $this->SubscriptionPayment->getLastPayed($payerId);
        if (isset($pay['SubscriptionPayment'])) {
          $id = $pay['SubscriptionPayment']['id'];
          $this->SubscriptionLog->verbose("Found previous payment: $id");
          $this->SubscriptionLog->verbose("Looking for related user: " . $pay['SubscriptionPayment']['user_id']);
          $pid = $pay['SubscriptionPayment']['subscription_package_id'];
          $user = $this->User->findById($pay['SubscriptionPayment']['user_id']);
          $this->SubscriptionLog->verbose("Looking for related package: " . $pay['SubscriptionPayment']['subscription_package_id']);
          $pkg = $this->SubscriptionPackage->findById($pid);
          $this->SubscriptionLog->verbose("Calculating next billing date");
          $exp = $this->SubscriptionPackage->calculateNextBillingDate($pkg, $user);
          $this->SubscriptionLog->verbose("Next billing date set to: " . $exp->format('Y-m-d'));
          $this->SubscriptionLog->verbose("Creating new payment from previous record.");

          unset($pay['SubscriptionPayment']['id']);
          unset($pay['SubscriptionPayment']['created']);
          unset($pay['SubscriptionPayment']['modified']);
          unset($pay['SubscriptionPayment']['billing_year']);
          unset($pay['SubscriptionPayment']['billing_number']);

          $pay['SubscriptionPayment']['status'] = 'Completed';
          $pay['SubscriptionPayment']['payment_id'] = $this->request->data('txn_id');
          $pay['SubscriptionPayment']['post_data'] = json_encode($this->request->data);
          $pay['SubscriptionPayment']['message'] = __('Recurring payment executed');
          $pay['SubscriptionPayment']['first_coupon_payment'] = 0;
          $pay['SubscriptionPayment']['invoice_status'] = 'none';

          $this->SubscriptionLog->verbose("Processing payment flagged as new for creation.");
          $this->SubscriptionPayment->create();
          // Generate invoice is not yet required, the payment is processed manually when user request invoice.
          // $generateInvoice = true;

          $this->SubscriptionLog->verbose("Generate invoice: $generateInvoice");

          // Coupon
          $coupon = null;
          $couponId = $pay['SubscriptionPayment']['subscription_coupon_id'];
          if ($couponId > 0) {
            $this->SubscriptionLog->verbose("Found coupon referencing last payment: $couponId");
            $coupon = $this->SubscriptionCoupon->findById($couponId);
            if (isset($coupon['SubscriptionCoupon'])) {
              $this->SubscriptionLog->verbose("Coupon code valid, checking rules.");
              $coupon = $coupon['SubscriptionCoupon'];
              if ($coupon['max_payments'] > 0) {
                $this->SubscriptionLog->verbose("Coupon has a max payments limit that needs to be checked.");
                $conditions = array();
                $conditions[] = array('subscription_coupon_id' => $couponId);
                $conditions[] = array('user_id' => $user['User']['id']);
                $count = $this->SubscriptionPayment->find('count', array('conditions' => $conditions));
                if ($count >= $coupon['max_payments']) {
                  $this->SubscriptionLog->verbose("Coupon max payments limit reached, we have to increment billing cycle amount with the original value.");
                  $package = $pkg['SubscriptionPackage'];
                  $order = $this->SubscriptionPayment->createOrder($package, $user);
                  try {
                    $this->SubscriptionLog->verbose("Contacting paypal to update recurring payment profile.");
                    $ppRequest = array(
                      'profile_id' => $pay['SubscriptionPayment']['profile_id'],
                      'args' => array(
                        'AMT' => $order['items'][0]['subtotal'],
                        'TAXAMT' => $order['items'][0]['tax'],
                        'CURRENCYCODE' => 'EUR'
                      )
                    );
                    $this->SubscriptionLog->verbose("Sending request to paypal: " . json_encode($ppRequest));
                    $res = $this->Paypal->updateRecurringPaymentsProfile($ppRequest);
                    $this->SubscriptionLog->verbose("Paypal response: " . json_encode($res));
                    unset($pay['SubscriptionPayment']['subscription_coupon_id']);
                  }
                  catch(Exception $e) {
                    $this->SubscriptionLog->verbose("Error contacting paypal: " . $e->getMessage());
                  }
                }
              }
            }
          }
        }
        else $paymentLost = true;
      }
      else $paymentLost = true;

      $this->SubscriptionPayment->begin();
      if ($paymentLost) {
        $this->SubscriptionLog->error("Payment lost.");
        $this->SubscriptionPaymentLost->save(array(
          'post_data' => json_encode($this->request->data)
        ));
      }
      else if (isset($pay) && isset($pay['SubscriptionPayment'])) {
        $this->SubscriptionLog->verbose("Creating payment.");
        if ($generateInvoice) {
          $this->SubscriptionLog->verbose("Generating invoice number");
          $bic = $this->SubscriptionPaymentBilling->findByYear(date('Y'));
          if (!isset($bic['SubscriptionPaymentBilling'])) {
            $bic = array('year' => date('Y'), 'number' => 1);
          }
          else {
            $bic = $bic['SubscriptionPaymentBilling'];
          }
          $pay['SubscriptionPayment']['billing_year'] = $bic['year'];
          $pay['SubscriptionPayment']['billing_number'] = $bic['number'];
          $bic['number'] = $bic['number'] + 1;
          $this->SubscriptionLog->verbose("Updating billing reference: " . $bic['number'] . "/" . $bic['year']);
          $this->SubscriptionPaymentBilling->save($bic);
        }
        $this->SubscriptionPayment->save($pay);
        $this->SubscriptionLog->verbose("Payment saved: " . $this->SubscriptionPayment->getInsertID());

        if (isset($exp) && !is_null($exp) && !is_null($user)) {
          $user['User']['expiry_date'] = $exp->format('Y-m-d');
          $this->SubscriptionLog->verbose("Updating user referal status.");
          $this->UserProp->changeProp($user, UserProp::REFERAL_STATUS, 'Acquired');
          $this->User->save($user);
        }
      }
      else {
        $ipnJson = json_encode($this->request->data);
        $this->SubscriptionLog->verbose("Unable to process this IPN notification: $ipnJson");
      }
      $this->SubscriptionPayment->commit();
      $this->SubscriptionLog->verbose("Process completed.");
    }

  }

?>
