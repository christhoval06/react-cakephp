<?php
  App::uses('Controller', 'Controller');

  class PagesController extends Controller {
    public function index() {
      $this->autoRender = false;
      $this->layout = null;
      $this->response->body('Ready to run!');
      $this->response->type('text/plain');
    }
  }
?>
