<?php
/**
 * Routes configuration
 *
 * In this file, you set up routes to your controllers and their actions.
 * Routes are very important mechanism that allows you to freely connect
 * different URLs to chosen controllers and their actions (functions).
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Config
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
/**
 * Here, we are connecting '/' (base path) to controller called 'Pages',
 * its action called 'display', and we pass a param to select the view file
 * to use (in this case, /app/View/Pages/home.ctp)...
 */
  Router::parseExtensions('xml', 'json');

  Router::connect('/', array('controller' => 'pages', 'action' => 'index'));
  Router::connect('/:lang', array(
    'controller' => 'pages',
    'action' => 'index'
  ), array(
    'pass' => array('lang')
  ));
  Router::connect('/:lang/', array(
    'controller' => 'pages',
    'action' => 'index'
  ), array(
    'pass' => array('lang')
  ));
  Router::connect(
    "/:controller/:id",
    array("action" => "preflight", "[method]" => "OPTIONS"),
    array("id" => "[0-9]+")
  );
  Router::connect('/rest/:folder/upload', array(
    'controller' => 'rest',
    'action' => 'uploadFile'
  ), array(
    'pass' => array('folder')
  ));
  Router::connect('/rest/:resource/list', array(
    'controller' => 'rest',
    'action' => 'getList'
  ), array(
    'pass' => array('resource'))
  );
  Router::connect('/rest/:resource/get/:id/:token', array(
    'controller' => 'rest',
    'action' => 'getItem'
  ), array(
    'pass' => array('resource', 'id', 'token')
  ));
  Router::connect('/rest/:resource/save', array(
    'controller' => 'rest',
    'action' => 'saveItem'
  ), array(
    'pass' => array('resource')
  ));
  Router::connect('/rest/:resource/delete/:id/:token', array(
    'controller' => 'rest',
    'action' => 'deleteItem'
  ), array(
    'pass' => array('resource', 'id', 'token')
  ));
  Router::connect('/rest/validate', array(
    'controller' => 'rest',
    'action' => 'validateToken'
  ));
  Router::connect('/rest/console/data', array(
    'controller' => 'restConsole',
    'action' => 'getData'
  ));
  Router::connect('/rest/subscription/print-invoice/:token/:id', array(
    'controller' => 'restSubscription',
    'action' => 'printInvoice'
  ), array(
    'pass' => array('token', 'id')
  ));
  Router::connect('/rest/subscription/buy-package', array(
    'controller' => 'restSubscription',
    'action' => 'buyPackage'
  ));
  Router::connect('/rest/subscription/create-payment', array(
    'controller' => 'restSubscription',
    'action' => 'createPayment'
  ));
  Router::connect('/rest/subscription/check-coupon', array(
    'controller' => 'restSubscription',
    'action' => 'checkCoupon'
  ));
  Router::connect('/rest/subscription/request-invoice', array(
    'controller' => 'restSubscription',
    'action' => 'requestInvoice'
  ));
  Router::connect('/rest/subscription/set-invoice', array(
    'controller' => 'restSubscription',
    'action' => 'setInvoice'
  ));
  Router::connect('/rest/subscription/status', array(
    'controller' => 'restSubscription',
    'action' => 'getStatus'
  ));
  Router::connect('/rest/subscription/ipn', array(
    'controller' => 'restSubscription',
    'action' => 'ipn'
  ));
  Router::connect('/subscriptions/ipn', array(
    'controller' => 'restSubscription',
    'action' => 'ipn'
  ));
  Router::connect('/rest/user/change-status', array(
    'controller' => 'restUser',
    'action' => 'changeStatus'
  ));
  Router::connect('/rest/user/change-password', array(
    'controller' => 'restUser',
    'action' => 'changePassword'
  ));
  Router::connect('/rest/user/reset-password', array(
    'controller' => 'restUser',
    'action' => 'resetPassword'
  ));
  Router::connect('/rest/user/profile', array(
    'controller' => 'restUser',
    'action' => 'getProfile'
  ));
  Router::connect('/rest/user/update-profile', array(
    'controller' => 'restUser',
    'action' => 'updateProfile'
  ));
  Router::connect('/rest/user/update-prop', array(
    'controller' => 'restUser',
    'action' => 'updateProp'
  ));
  Router::connect('/rest/user/check-expiring-accounts', array(
    'controller' => 'restUser',
    'action' => 'checkExpiringAccounts'
  ));
  Router::connect('/rest/user/check-expired-accounts', array(
    'controller' => 'restUser',
    'action' => 'checkExpiredAccounts'
  ));
  Router::connect('/rest/user/contact', array(
    'controller' => 'restUser',
    'action' => 'contact'
  ));
  Router::connect('/rest/user/signup', array(
    'controller' => 'restUser',
    'action' => 'signup'
  ));

  Router::connect('/rest/deal/:action', array(
    'controller' => 'restDeal'
  ));
/**
 * Load all plugin routes. See the CakePlugin documentation on
 * how to customize the loading of plugin routes.
 */
	CakePlugin::routes();

/**
 * ...and connect the rest of 'Pages' controller's URLs.
 */


/**
 * Load the CakePHP default routes. Only remove this if you do not want to use
 * the built-in default routes.
 */
	require CAKE . 'Config' . DS . 'routes.php';
