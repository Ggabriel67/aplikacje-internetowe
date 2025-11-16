<?php

/** @var \App\Model\CelestialBody $celestialBody */
/** @var \App\Service\Router $router */

$title = 'Create Celestial Body';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Celestial Body</h1>
    <form action="<?= $router->generatePath('celestial_body-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="celestial_body-create">
    </form>

    <a href="<?= $router->generatePath('celestial_body-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
