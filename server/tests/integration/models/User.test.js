// tests/unit/models/User.test.js
const { User } = require('../../../models');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  // Test des hooks beforeCreate/beforeUpdate pour le hachage du mot de passe
  test('should hash password before creating user', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'plainpassword',
      role: 'user'
    });
    
    // Vérifier que le mot de passe est haché
    expect(user.password).not.toBe('plainpassword');
    // Vérifier avec bcrypt que le hachage correspond
    const isMatch = await bcrypt.compare('plainpassword', user.password);
    expect(isMatch).toBe(true);
  });
  
  // Test de la méthode checkPassword
  test('checkPassword method should correctly verify passwords', async () => {
    const user = await User.create({
      username: 'passworduser',
      email: 'password@example.com',
      password: 'mypassword123',
      role: 'user'
    });
    
    // Vérifier un mot de passe valide
    const validCheck = await user.checkPassword('mypassword123');
    expect(validCheck).toBe(true);
    
    // Vérifier un mot de passe invalide
    const invalidCheck = await user.checkPassword('wrongpassword');
    expect(invalidCheck).toBe(false);
  });
});