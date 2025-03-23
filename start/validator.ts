import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'string': 'Ce champ {{ field }} doit être une chaine de caractères',
  'email': 'Veuillez bien vouloir entrer un email valide',
  'required': 'Ce champ est obligatoire',

  'username': 'Veuillez entrer au moins 5 caractères',
  'username.minLength': 'Veuillez entrer au moins 5 caractères',

  'password': 'Veuillez entrer un mot de passe ',
  'password.minLength': 'Veuillez entrer au moins 8 caractères',
  'password.regex':
    'Veuillez entrer au moins 1 lettre majuscule, 1 minuscule, 1 chiffre et 1 caractère special($,%,@)',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)
