<?php
echo "PHP_BINARY: " . PHP_BINARY . "\n";
echo "Loaded INI: " . php_ini_loaded_file() . "\n";
print_r(PDO::getAvailableDrivers());
print_r($_SERVER);
