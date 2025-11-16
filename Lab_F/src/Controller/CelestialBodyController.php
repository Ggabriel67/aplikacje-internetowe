<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\CelestialBody;
use App\Service\Router;
use App\Service\Templating;


class CelestialBodyController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $celestialBodies = CelestialBody::findAll();
        $html = $templating->render('celestial_body/index.html.php', [
            'celestialBodies' => $celestialBodies,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestCelestialBody, Templating $templating, Router $router): ?string
    {
        if ($requestCelestialBody) {
            $celestialBody = CelestialBody::fromArray($requestCelestialBody);
            $celestialBody->save();

            $path = $router->generatePath('celestial_body-index');
            $router->redirect($path);
            return null;
        } else {
            $celestialBody = new CelestialBody();
        }

        $html = $templating->render('celestial_body/create.html.php', [
            'celestialBody' => $celestialBody,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $celestialBodyId, ?array $requestCelestialBody, Templating $templating, Router $router): ?string
    {
        $celestialBody = CelestialBody::find($celestialBodyId);
        if (! $celestialBody) {
            throw new NotFoundException("Missing celestial body with id $celestialBodyId");
        }

        if ($requestCelestialBody) {
            $celestialBody->fill($requestCelestialBody);
            $celestialBody->save();

            $path = $router->generatePath('celestial_body-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('celestial_body/edit.html.php', [
            'celestialBody' => $celestialBody,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $celestialBodyId, Templating $templating, Router $router): ?string
    {
        $celestialBody = CelestialBody::find($celestialBodyId);
        if (! $celestialBody) {
            throw new NotFoundException("Missing celestial body with id $celestialBodyId");
        }

        $html = $templating->render('celestial_body/show.html.php', [
            'celestialBody' => $celestialBody,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $celestialBodyId, Router $router): ?string
    {
        $celestialBody = CelestialBody::find($celestialBodyId);
        if (! $celestialBody) {
            throw new NotFoundException("Missing celestial body with id $celestialBodyId");
        }

        $celestialBody->delete();
        $path = $router->generatePath('celestial_body-index');
        $router->redirect($path);
        return null;
    }
}
