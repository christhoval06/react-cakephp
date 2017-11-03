<?php
  class PingShell extends AppShell {
    public $tasks = array('Ping');

    public function main() {
      $this->out("Executing Ping.");
      $this->Ping->execute();
    }
  }

?>
