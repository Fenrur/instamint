# Instamint

<!-- TOC -->
* [Instamint](#instamint)
  * [📘 Préambule](#-préambule)
    * [📢 Présentation](#-présentation)
    * [📚 Objectifs](#-objectifs)
  * [Technologies](#technologies)
    * [🛠️ Stack technique](#-stack-technique)
      * [TypeScript](#typescript)
      * [Next.js](#nextjs)
      * [Tailwind CSS](#tailwind-css)
      * [Shadcn](#shadcn)
      * [PostgresSQL](#postgressql)
      * [DrizzleORM](#drizzleorm)
      * [Auth.js](#authjs)
      * [Vercel](#vercel)
  * [Initialisation](#initialisation)
    * [Prérequis](#prérequis)
    * [Variables d'environnement](#variables-denvironnement)
      * [Configuration de la base de données](#configuration-de-la-base-de-données)
      * [Configuration de l'envoi d'email](#configuration-de-lenvoi-demail)
      * [Configuration du secret de hashage des mots de passe](#configuration-du-secret-de-hashage-des-mots-de-passe)
        * [Génération du secret](#génération-du-secret)
      * [Configuration du secret de chiffrement des tokens](#configuration-du-secret-de-chiffrement-des-tokens)
        * [Génération du secret](#génération-du-secret-1)
      * [Configuration de la sécurité des cookies](#configuration-de-la-sécurité-des-cookies)
      * [Configuration de la clé de chiffrement TOTP](#configuration-de-la-clé-de-chiffrement-totp)
        * [Génération de la clé](#génération-de-la-clé)
      * [Configuration de l'URL de base](#configuration-de-lurl-de-base)
      * [Configuration de l'email de contact](#configuration-de-lemail-de-contact)
    * [Installation](#installation)
  * [Démarrage](#démarrage)
    * [Base de données](#base-de-données)
    * [Serveur de développement](#serveur-de-développement)
    * [Serveur de production](#serveur-de-production)
    * [Migrations](#migrations)
<!-- TOC -->

## 📘 Préambule

### 📢 Présentation

Ce projet est réalisé dans un but pédagogique. Il a pour objectif de mettre en pratique les compétences acquises lors de notre formation de développeur à l'école Sup de Vinci.

Il est encadré par notre formateur, [Avétis KAZARIAN](https://www.linkedin.com/in/avetisk/), et nous tenons à le remercier pour son accompagnement et ses précieux conseils.

### 📚 Objectifs

Le projet d’étude a pour but de créer une expérience professionnelle complète pour chaque alternant, couvrant l’ensemble des compétences clefs étudiées en cours par une mise en pratique concrète, en groupe, dans un environnement au plus proche de la réalité professionnelle, en implémentant les requis et contraintes d’une entreprise dans son cycle naturel de production en méthode agile. Il permet aux alternants de palier l’absence éventuelle de la mise en pratique de certaines compétences dans le cadre de leur entreprise, en leur apportant la possibilité de les mettre en application dans celui du projet d’étude, avec l’encadrement et le suivi nécessaire à leur assimilation, couvrant l’ensemble des sujets abordés sur l’année.

L'accent n’est pas sur les compétences en programmation pure mais sur l’ensemble de processus allant de l’idée à la matière, c'est-à-dire de l’appel d’offre à la livraison finale. Il est en effet nécessaire d’inclure ici tous les aspects non-techniques et pourtant si nécessaires à la réalisation d’un projet de développement. Ainsi, les alternants seront contraints, comme dans le monde professionnel, d’utiliser leur compétence technique mais également l’ensemble de leurs soft skills pour l'entière réussite du projet, sans oublier d’apporter un regard critique sur l’impact de leurs choix sur l’environnement et leur durabilité.

## Technologies

### 🛠️ Stack technique

#### [TypeScript](https://www.typescriptlang.org/)

TypeScript est un sur-ensemble de JavaScript qui ajoute des fonctionnalités de typage statique en option à ce langage. TypeScript est conçu pour le développement d'applications large échelle et transcompile en JavaScript.

Ce choix a été fait pour plusieurs raisons :
- Le typage statique permet de détecter des erreurs à la compilation plutôt qu'à l'exécution
- Facilite la lecture du code
- Mieux comprendre le code
- Mieux maintenir le code
- Mieux travailler en équipe

#### [Next.js](https://nextjs.org/)

Next.js est un framework web open-source de développement backend et front-end avec React. Il permet des fonctionnalités telles que le rendu côté serveur et la génération de sites statiques pour les sites web basés sur React.

Ce choix a été fait pour plusieurs raisons :
- Créer une application dans un meme environnement pour le backend et le frontend
- Générer des pages coté serveur pour les parties accessibles dites `publiques` et permettre un meilleur référencement
- Choisir entre le rendu coté serveur et le rendu coté client
- Internationalisation intégrée
- Support TypeScript
- Ecosystème riche

#### [Tailwind CSS](https://tailwindcss.com/)

Tailwind CSS est un framework CSS qui permet de créer des designs personnalisés sans jamais quitter le fichier HTML. Il est basé sur une approche de conception de composants et de classes utilitaires.

Ce choix a été fait pour plusieurs raisons :
- Facilite la création de composants
- Facilite la maintenance du code
- Facilite le travail en équipe

#### [Shadcn](https://ui.shadcn.com/)

Beautifully designed components, qui se base sur Tailwind CSS pour la stylisation des composants.

Ce choix a été fait pour plusieurs raisons :
- Large bibliothèque de composants
- Facilite le changement de style dans nos besoins

#### [PostgresSQL](https://www.postgresql.org/)

PostgreSQL est une base de données relationnelle open-source et gratuite. Elle est reconnue pour sa fiabilité et sa robustesse.

Ce choix a été fait pour plusieurs raisons :
- Base de données relationnelle
- Open-source et gratuite
- Conformité ACID
- Support des standards SQL
- Performances et Fiabilité
- Sécurité
- Large de type de données comparé à d'autres bases de données

#### [DrizzleORM](https://orm.drizzle.team/)

Drizzle est un ORM (Object-Relational Mapping) pour TypeScript. Il permet de manipuler les données de la base de données, en gardant la syntaxe SQL.

Drizzle is lightweight, performant, typesafe, non lactose, gluten-free, sober, and flexible by design.

Ce choix a été fait pour plusieurs raisons :
- Facilite la manipulation des données
- Syntaxe SQL
- Typesafe
- Performant
- Flexible
- Facilite les jointures

#### [Auth.js](https://authjs.dev/)

Auth.js est une bibliothèque d'authentification. Elle permet de gérer l'authentification des utilisateurs.

Il peut utiliser plusieurs stratégies d'authentification, telles que les jetons JWT, les cookies, etc.

Aussi différents protocolles d'authentification, tels que OAuth2, OpenID Connect, etc.

Ce choix a été fait pour la principale raison suivante:
- Facilite l'authentification

Dans notre cas, nous utilisons la stratégie JWT, en utilisant les cookies. Avec une connection sans provider tiers.

#### [Vercel](https://vercel.com)

Vercel est une plateforme de déploiement de sites web. Elle permet de déployer des applications Next.js, React, Angular, Vue, etc.

Vercel se connecte à notre dépôt GitHub et déclenche un déploiement à chaque push.

Ce choix a été fait pour plusieurs raisons :
- Facilite le déploiement
- Facilite la gestion des environnements
- Facilite la gestion des domaines

## Initialisation

### Prérequis

- Node.js (dans le path)
- docker (dans le path)

### Variables d'environnement

Vous pouvez créer un fichier `.env` à la racine du projet pour définir les variables d'environnement. Ou vous pouvez les définir directement dans votre environnement.

```dotenv
DATABASE_URL=""
GMAIL_EMAIL=""
GMAIL_PASS=""
PEPPER_PASSWORD_SECRET=""
NEXT_AUTH_SECRET=""
SECURE_AUTH_COOKIES=""
TOTP_ENCRYPTION_KEY=""
BASE_URL=""
CONTACT_EMAIL=
```

#### Configuration de la base de données

Exemple de configuration pour une base de données PostgreSQL:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

Vous pouvez vous référer à la documentation de [PostgreSQL](https://www.postgresql.org/docs/current/libpq-connect.html) pour plus d'information sur le schema de l'URL de connexion.

#### Configuration de l'envoi d'email

Exemple de configuration pour l'envoi d'email avec Gmail:

```dotenv
GMAIL_EMAIL="instamint.noreply@gmail.com"
GMAIL_PASS="adqs refq geac oefg"
```

`GMAIL_EMAIL` est l'adresse email de l'expéditeur.
`GMAIL_PASS` est le mot de passe de l'application.

> 🚨 Pour des raisons de sécurité, il est recommandé de créer un mot de passe d'application pour l'envoi d'email.

Pour plus d'information, vous pouvez consulter la documentation de [Google](https://support.google.com/accounts/answer/185833?hl=en).

#### Configuration du secret de hashage des mots de passe

Exemple de configuration pour le secret de chiffrement des mots de passe:

```dotenv
PEPPER_PASSWORD_SECRET="xbHTJXqZe2MzqjfBkNJUB2dk11eCut5K7IGOIQOEHvA="
```

`PEPPER_PASSWORD_SECRET` a pour but de sécuriser les mots de passe qui sont stockés dans la base de données.

##### Génération du secret

Vous pouvez générer un secret avec la commande suivante:

```bash
openssl rand -base64 32
```

#### Configuration du secret de chiffrement des tokens

Exemple de configuration pour le secret de chiffrement des tokens:

```dotenv
NEXT_AUTH_SECRET="qfU8rXFxpv79amTEFKPTWLC9pF276wWDGqrHRZ+oOA8="
```

`NEXT_AUTH_SECRET` a pour but de sécuriser les tokens qui sont stockés dans les cookies.

##### Génération du secret

Vous pouvez générer un secret avec la commande suivante:

```bash
openssl rand -base64 32
```

#### Configuration de la sécurité des cookies

Exemple de configuration pour la sécurité des cookies:

```dotenv
SECURE_AUTH_COOKIES="true"
```

`SECURE_AUTH_COOKIES` est un booléen qui permet de sécuriser les cookies.

Pour plus d'information, vous pouvez consulter la documentation de [MDN](https://developer.mozilla.org/en/docs/Web/HTTP/Cookies).

En général, il est recommandé de mettre cette variable à `true` en production.

#### Configuration de la clé de chiffrement TOTP

Exemple de configuration pour la clé de chiffrement TOTP:

```dotenv
TOTP_ENCRYPTION_KEY="u6Y7RMVib/s73+L8Jegn2QggNQZQbVYtiVPBDxPrztg="
```

Il a pour but de sécuriser les tokens TOTP qui sont stockés en base de données.

##### Génération de la clé

Vous pouvez générer une clé avec la commande suivante:

```bash
openssl rand -base64 32
```

#### Configuration de l'URL de base

Exemple de configuration pour l'URL de base:

```dotenv
BASE_URL="http://localhost:3000"
```

`BASE_URL` est l'URL de base de l'application. Attention, il doit être en accord avec le serveur à son exécution.

#### Configuration de l'email de contact


Exemple de configuration pour l'email de contact:

```dotenv
CONTACT_EMAIL="instamint.contact@gmail.com"
```

`CONTACT_EMAIL` est l'adresse email de contact.


### Installation

- Cloner le dépôt


- Installer les dépendances

```bash
npm install
```

## Démarrage

### Base de données

Démarrer la base de données:

```bash
docker-compose up -d
```

Les valeurs peuvent être modifiées dans le fichier `docker-compose.yml`.

Les valeurs par défaut sont:

- `USER`: `instamint`
- `PASSWORD`: `instamint`
- `DATABASE`: `instamint`

### Serveur de développement

Démarrer le serveur de développement:

```bash
npm run dev
```

### Serveur de production

Démarrer le serveur de production:

```bash
npm run build && npm start
```

### Migrations

Pour exécuter les migrations:

```bash
npm run migrate
```

Pour annuler les migrations:

```bash
npm run rollback
```

## Dataset

Le dataset est disponible dans le fichier `dataset.sql`.

> 🚨 Pour qu'il fonctionne vous devez avoir les memes valeurs pour les variables d'environnement.

Voici les variables d'environnement utilisées pour le dataset:

```dotenv
PEPPER_PASSWORD_SECRET="GA5mG3yU8ulHsdRBc7OhbinYuyBd54RGLnxbQnswAgQ="
TOTP_ENCRYPTION_KEY=QiFAlean+1ueZ7y/HmLgs7cLP52hdjJ4oipZQZK1olQ=
```
