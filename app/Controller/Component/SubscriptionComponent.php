<?php
  App::uses('Component', 'Controller');
  class SubscriptionComponent extends Component {
    public $components = array('Auth');

    public function getStatus() {
      $days = $this->_getDays();
      $pays = ClassRegistry::init('SubscriptionPayment')->find('count', array(
        'conditions' => array(
          'user_id' => $this->Auth->user('id')
        )
      ));
      $status = $pays > 0 ? "Active" : "None";
      if($status != "None" || $days < 7) {
        if($days < 0) {
          $status = "Expired";
        }
        else if($days <= 15) {
          $status = "Expiring";
        }
      }
      return $status;
    }

    public function getExpiryDate($user = null) {
      if(!is_null($user)) {
        if(isset($user['expiry_date'])) {
          return $user['expiry_date'];
        }
        else if(isset($user['User'])) {
          return $user['User']['expiry_date'];
        }
      }
      return $this->Auth->user('expiry_date');
    }

    public function getRemainingDays($user = null) {
      $abs = true;
      return $this->_getDays($abs, $user);
    }

    public function getStatusInfo() {
      return array(
        'status' => $this->getStatus(),
        'expiryDate' => $this->getExpiryDate(),
        'remainingDays' => $this->getRemainingDays()
      );
    }

    function _getDays($abs = false, $user = null) {
      if (is_null($user)) {
        $user = ClassRegistry::init('User')->findById($this->Auth->user('id'));
      }

      if (isset($user['expiry_date'])) {
        $expiryDate = $user['expiry_date'];
      }
      else if (isset($user['User'])) {
        $expiryDate = $user['User']['expiry_date'];
      }

      $today = new DateTime(null);
      $date = new DateTime($expiryDate);
      $days = (int)$today->diff($date)->format('%r%a');

      if($days < 0 && $abs) {
        $days = 0;
      }
      return $days;
    }
  }
?>
