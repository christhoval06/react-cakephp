<?php
  class WhoisController extends Controller {
    public $components = array('Whois', 'RequestHandler');

    public function index() {
      $ip = $this->request->query('ip');
      $whois = $this->Whois->resolve($ip);
      $this->set('whois', $whois);
      $this->set('_serialize', array('whois'));
    }
    public function range() {
      $cidr = $this->request->query('cidr');
      $range = $this->Whois->range($cidr);
      $this->set('range', $range);
      $this->set('_serialize', array('range'));
    }
  }
?>
