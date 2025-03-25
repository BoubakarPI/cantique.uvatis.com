# Projet Cantique - Mooré

Ce projet est une petite application qui servirait de back-office développée avec **AdonisJS 6**, **PostgreSQL**, **UnoCSS**, et **Cloudflare R2** (via le SDK AWS-S3) pour la gestion et l'upload de fichiers audio. L'architecture utilisée est **hexagonale**, mais adaptée pour gérer **InertiaJS**, permettant une meilleure séparation des préoccupations tout en exploitant pleinement les capacités du SSR et du SPA.

### Application mobile

Ce système d'administration est destiné à l'application mobile développée par [Serge Eric KALAGA](https://github.com/serge-eric-kalaga).


## 🏗️ Technologies utilisées

- **Backend** : AdonisJS 6 (TypeScript): Mon framework de cœur ❤️
- **Base de données** : PostgreSQL
- **Frontend** : Vue 3 avec InertiaJS
- **UI** : UnoCSS (parce que Tailwind n'avait qu'à mieux se tenir 😎)
- **Stockage des fichiers** : Cloudflare R2 via AWS SDK
- **Gestion des migrations** : Lucid ORM (AdonisJS)
- **Middleware** : Authentification, Session, Protection CSRF

---

## 📂 Structure du projet

```plaintext
cantique.uvatis.com/
├── ace.js
├── adonisrc.ts
├── package.json
├── tsconfig.json
├── uno.config.ts
├── vite.config.ts
├── .env.example
├── app/
│   ├── data/                # Couche Infrastructure
│   │   ├── controllers/      # Contrôleurs HTTP
│   │   ├── repositories/     # Implémentations des repositories
│   │   ├── types/            # Interfaces et types
│   │   ├── utils/            # Utilitaires divers
│   │   ├── validators/       # Validateurs de données
│   ├── domain/               # Couche Domaine
│   │   ├── contracts/        # Interfaces des repositories
│   │   ├── dto/              # Objets de transfert de données
│   │   └── usecases/         # Cas d'utilisation (logique métier)
│   ├── exceptions/
│   ├── middleware/
├── config/                   # Configuration de l'application
├── database/                  # Migrations, seeders et factories
├── inertia/                   # Code du frontend InertiaJS
├── providers/                 # Providers AdonisJS
├── start/                     # Points d'entrée et configuration
└── tests/                     # Tests API et unitaires
```

L'architecture suit un modèle **hexagonal adapté**, où :
- **Domaine** gère la logique métier pure
- **Infrastructure** gère les interactions avec la base de données, le stockage et les services externes
- **Controllers** gèrent la communication avec le frontend InertiaJS

---

## Installation et démarrage

### 1️⃣ Prérequis
- Node.js 20+
- PostgreSQL installé et configuré
- Un compte Cloudflare R2 (avec clés d'accès API)

### 2️⃣ Installation

```bash
git clone https://github.com/boubakarpi/cantique.uvatis.com.git
cd cantique.uvatis.com
cp .env.example .env
npm install
```

### 3️⃣ Configuration
Dans le fichier `.env`, configure :
```ini
DB_CONNECTION=pg
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_NAME=cantique

AWS_ACCESS_KEY_ID=VOTRE_CLE
AWS_SECRET_ACCESS_KEY=VOTRE_SECRET
AWS_REGION=auto
AWS_BUCKET=nom_du_bucket_r2
AWS_ENDPOINT=https://nom_du_compte.r2.cloudflarestorage.com
```

### 4️⃣ Exécuter les migrations
```bash
node ace migration:run
```

### 5️⃣ Lancer le projet
```bash
npm run dev
```

---

## 📡 API Routes principales

### 🔐 Authentification
### Routes

| **METHOD** | **ROUTE**                  | **DESCRIPTION**                                             | **MIDDLEWARE** |
|------------|----------------------------|-------------------------------------------------------------|----------------|
| GET        | /auth/login                | Affiche la page de connexion de l'utilisateur               |                |
| POST       | /auth/login                | Traite la soumission du formulaire de connexion             |                |
| DELETE     | /auth/logout               | Déconnecte l'utilisateur en supprimant sa session           | auth           |
| GET        | /                          | Page d'accueil ou page d'index                               | auth           |
| POST       | /api/upload                | Gère l'upload de fichiers                                    | auth           |
| GET        | /api/files                 | Récupère la liste des fichiers disponibles sur le serveur   | auth           |

---

## 🏗️ Déploiement

## Flux de déploiement

Ce projet utilise un script Makefile avec Docker Compose pour automatiser le déploiement de l'application sur un mini VPS (On ne va pas se casser la tête avec des instances pour une telle petite app).

### Prérequis

- Docker
- Docker Compose
- Accès SSH à un serveur distant (VPS)
- Make (facultatif, mais recommandé pour l'automatisation)

### Configurations

Avant d'exécuter les commandes, vous devez mettre à jour les valeurs suivantes dans le Makefile :

- `VPS_IP` : L'adresse IP de votre VPS.
- `VPS_USER` : L'utilisateur pour la connexion SSH (par défaut `root`).
- `APP_DIR` : Le répertoire sur votre VPS où l'application doit être déployée.
- `IMAGE_NAME` : Le nom de l'image Docker à construire.
- `TAG_FILE` : Le fichier où le tag de l'image est stocké.

### Commandes Makefile

#### 1. Construire l'image Docker

Cette commande construit l'image Docker en utilisant `docker-compose` sans cache et la tague avec un numéro de version incrémenté.

```bash
make build-image
```

#### 2. Déployer sur le VPS

Cette commande va :
- Vérifier et incrémenter le tag de la version.
- Construire l'image Docker.
- Envoyer l'image sur le serveur distant.
- Déployer l'image sur le serveur à l'aide de Docker Compose.

```bash
make deploy
```

### Détail du Makefile

```makefile
.PHONY: deploy build-image push-image deploy-remote check-tag

# Configurations
VPS_IP = xx.xx.xx.xx
VPS_USER = root
APP_DIR = /var/www/html/chemin/vers/un/dossier
IMAGE_NAME = uvatis/cantique
TAG_FILE = .tag

# Commande principale de déploiement
deploy: check-tag build-image push-image deploy-remote

# Vérification et incrémentation du tag
check-tag:
	@echo "🔢 Vérification et incrémentation du tag..."
	@if [ ! -f $(TAG_FILE) ]; then echo "0" > $(TAG_FILE); fi
	@NEW_TAG=$$(($(shell cat $(TAG_FILE)) + 1)) && echo $$NEW_TAG > $(TAG_FILE)
	@echo "📌 Nouveau tag: $$(cat $(TAG_FILE))"

# Construction de l'image Docker
build-image:
	@echo "🐳 Construction de l'image Docker..."
	@docker compose build --no-cache
	@docker tag $(IMAGE_NAME):latest $(IMAGE_NAME):$$(cat $(TAG_FILE))

# Envoi de l'image et des fichiers
push-image:
	@echo "🚀 Envoi de l'image sur le serveur..."
	@docker save $(IMAGE_NAME):$$(cat $(TAG_FILE)) | ssh $(VPS_USER)@$(VPS_IP) "docker load"
	@echo "📂 Envoi de compose.yaml et .env.docker..."
	@rsync -avz compose.yaml .env.docker $(VPS_USER)@$(VPS_IP):$(APP_DIR)

# Déploiement sur le serveur distant
deploy-remote:
	@echo "🛠️ Déploiement de la nouvelle version sur le serveur..."
	@ssh $(VPS_USER)@$(VPS_IP) "cd $(APP_DIR) && \
		export TAG=$$(cat $(TAG_FILE)) && \
		echo '🔄 Arrêt du conteneur existant...' && \
		docker compose down && \
		echo '🚀 Démarrage du nouveau conteneur...' && \
		docker compose up -d && \
		echo '✅ Déploiement terminé avec succès !'"
```

---

## 📝 Notes

- Assurez-vous que Docker et Docker Compose sont installés à la fois sur votre machine locale et sur votre VPS.
- Vérifiez que votre VPS dispose des permissions nécessaires pour exécuter les commandes Docker.
- Vous pouvez ajuster les valeurs `VPS_USER` et `APP_DIR` pour correspondre à la configuration de votre serveur.

---

## 📜 Licence
Ce projet est sous licence MIT. N'hésitez pas à contribuer ! 🚀

