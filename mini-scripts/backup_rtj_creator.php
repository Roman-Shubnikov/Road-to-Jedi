<?php
$config = [
    // ip адрес сервера, с которого будем копировать базу
    'ip'              => '188.225.47.17',
    // Путь до папки в которой будут лежать дампы баз
    'path'            => '/root/database_backups/roadjedi',
    // Шаблон имени файла дампа базы. Вместо <date> подставится дата в формате 20-04-2019_12:00
    'filenamePattern' => 'dump_' . date("d.m.Y_H:i:s") . '.sql',
    // Максимальное количество дампов, хранящихся на сервере
    'maxFilesCount'   => 20,
    // Настройка подключения к БД
    'db' => [
        'name'     => 'roadjedi',
        'user'     => 'root',
        'password' => '1qazse45',
    ],
];

$command = "mysqldump -u " . $config['db']['user'] ." -p" . $config['db']['password'] . " " . $config['db']['name'] . " > " . $config['path'] . "/" . $config['filenamePattern'];
exec($command);
 
if (!empty($config['maxFilesCount'])) {
    cleanDirectory($config['path'], $config['maxFilesCount']);
}
 
/**
 * Clears the directory of the files, leaving no more than $maxFilesCount number of files
 *
 * @param string $dir
 * @param string $maxFilesCount
 */
function cleanDirectory($dir, $maxFilesCount)
{
    $filenames = [];
 
    foreach(scandir($dir) as $file) {
        $filename = "$dir/$file";
        if (is_file($filename)) {
            $filenames[] = $filename;
        }
    }
 
    if (count($filenames) <= $maxFilesCount) {
        return;
    }
 
    $freshFilenames = array_reverse($filenames);
    array_splice($freshFilenames, $maxFilesCount);
    $oldFilenames = array_diff($filenames, $freshFilenames);
 
    foreach ($oldFilenames as $filename) {
        unlink($filename);
    }
}