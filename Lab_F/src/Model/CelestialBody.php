<?php

namespace App\Model;

use App\Service\Config;

class CelestialBody
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $type = null;
    private ?int $radius = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): CelestialBody
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): CelestialBody
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): CelestialBody
    {
        $this->type = $type;
        return $this;
    }

    public function getRadius(): ?int
    {
        return $this->radius;
    }

    public function setRadius(?int $radius): CelestialBody
    {
        $this->radius = $radius;
        return $this;
    }

    public static function fromArray($array): CelestialBody {
        $celestialBody = new self();
        $celestialBody->fill($array);
        return $celestialBody;
    }

    public function fill(array $array): CelestialBody {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['type'])) {
            $this->setType($array['type']);
        }
        if (isset($array['radius'])) {
            $this->setRadius($array['radius']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM celestial_body';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $celestialBodies = [];
        $celestialBodiesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($celestialBodiesArray as $celestialBodyArray) {
            $celestialBodies[] = self::fromArray($celestialBodyArray);
        }

        return $celestialBodies;
    }

    public static function find($id): ?CelestialBody
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM celestial_body WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $celestialBodyArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $celestialBodyArray) {
            return null;
        }
        $celestialBody = CelestialBody::fromArray($celestialBodyArray);

        return $celestialBody;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO celestial_body (name, type, radius) VALUES (:name, :type, :radius)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'type' => $this->getType(),
                'radius' => $this->getRadius(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE celestial_body SET name = :name, type = :type, radius = :radius WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'type' => $this->getType(),
                'radius' => $this->getRadius(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM celestial_body WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setType(null);
        $this->setRadius(null);
    }
}
