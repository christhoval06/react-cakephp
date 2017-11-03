<?php
  class EmailConfig {
    public $aws = array(
        'host' => 'email.amazonaws.com',
        'port' => 587,
        'from' => 'noreply@app.com',
        'username' => '?',
        'password' => '?',
        'transport' => 'Smtp',
        'tls' => true
    );
  }
?>
