.PHONY: deploy build-image push-image deploy-remote check-tag

# Configurations
VPS_IP = xx.xx.xx.xx
VPS_USER = root
APP_DIR = /var/www/html/chemin/vers/un/dossier
IMAGE_NAME = uvatis/cantique
TAG_FILE = .tag

# Commande principale de déploiement
deploy: check-tag build-image push-image deploy-remote

# Vérifie et incrémente le tag
check-tag:
	@echo "🔢 Vérification et incrémentation du tag..."
	@if [ ! -f $(TAG_FILE) ]; then echo "0" > $(TAG_FILE); fi
	@NEW_TAG=$$(($(shell cat $(TAG_FILE)) + 1)) && echo $$NEW_TAG > $(TAG_FILE)
	@echo "📌 Nouveau tag: $$(cat $(TAG_FILE))"

# Construction de l'image
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
