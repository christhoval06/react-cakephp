<?php
  App::uses('Controller', 'Controller');
  App::uses('UserProp', 'Model');

  class RestConsoleController extends Controller {
    public $components = array(
      'Rest'
    );
    public $uses = array(
      'User',
      'UserProp',
      'Deal',
      'DealCategory',
      'ShellTask'
    );

    public function getData() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error("Not found.");
      }

      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);

      $lang = Configure::read('Config.language');
      if (isset($request['lang'])) {
        $lang = $request['lang'];
        Configure::write('Config.language', $lang);
      }
      $data = array(
        'indicators' => array(
          /*array(
            'glyph' => 'tags',
            'name' => __("categories"),
            'link' => '/deal-category/grid',
            'value' => $this->DealCategory->find('count')
          )^/*/
        ),
        'tables' => array(
          /*array(
          array(
            'icon' => 'time',
            'title' => __('Last logs'),
            'link' => '/campaign-log/grid',
            'linkLabel' => __('View logs'),
            'columns' => array(
              'created',
              'ip',
              'country_code'
            ),
            'rows' => $this->Rest->compact('CampaignLog', $this->CampaignLog->find('all', array(
              'fields' => array('created', 'ip', 'country_code'),
              'conditions' => $conditions,
              'limit' => 10
            )))
          ),
          array(
            'icon' => 'lock',
            'title' => __('Last cloaked views'),
            'link' => '/campaign-log/grid',
            'linkLabel' => __('View logs'),
            'columns' => array(
              'created',
              'ip',
              'cloak_reason'
            ),
            'rows' => $this->Rest->compact('CampaignLog', $this->CampaignLog->find('all', array(
              'fields' => array('created', 'ip', 'cloak_reason'),
              'conditions' => array_merge($conditions, array(
                'is_cloaked'=> 1
              )),
              'limit' => 10
            )))
          )*/
        )
      );
      return $this->Rest->json($data);
    }

  }

?>
