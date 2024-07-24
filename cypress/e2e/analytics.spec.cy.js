describe('Analytics API Endpoints', () => {
  it('should retrieve top-selling books by genre', () => {
    cy.request('/api/analytics/topbooks').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should retrieve user purchase patterns', () => {
    cy.request('/api/analytics/userpatterns').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should retrieve sales trends over time', () => {
    cy.request('/api/analytics/salestrends').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });
});
