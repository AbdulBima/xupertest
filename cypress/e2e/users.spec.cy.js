describe('Users API Endpoints', () => {
  const userData = {
    username: 'testuser',
    password: 'testpassword'
  };

  let token;

  it('should register a new user', () => {
    cy.request('POST', '/api/users/register', userData).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('should login a user', () => {
    cy.request('POST', '/api/users/login', userData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      token = response.body.token;
    });
  });

  it('should assign a role to a user', () => {
    const roleData = { username: userData.username, role: 'Admin' };
    cy.request({
      method: 'POST',
      url: '/api/users/role',
      body: roleData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
