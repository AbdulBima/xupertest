describe('Books API Endpoints', () => {
  const bookData = {
    title: 'Test Book',
    author: 'Test Author',
    price: 9.99,
    stock: 100,
    sourceCurrency: 'USD'
  };

  let bookId;

  it('should create a new book', () => {
    cy.request('POST', '/api/books', bookData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      bookId = response.body.id;
    });
  });

  it('should retrieve a list of books', () => {
    cy.request('/api/books').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should retrieve a book by ID', () => {
    cy.request(`/api/books/${bookId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', bookId);
    });
  });

  it('should update a book by ID', () => {
    const updatedData = { price: 19.99, stock: 50 };
    cy.request('PUT', `/api/books/${bookId}`, updatedData).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should delete a book by ID', () => {
    cy.request('DELETE', `/api/books/${bookId}`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should retrieve external details of a book by ID', () => {
    cy.request(`/api/books/${bookId}/external`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('isbn');
    });
  });

  it('should convert the price of a book to a different currency', () => {
    const targetCurrency = 'EUR';
    cy.request(`/api/books/${bookId}/convert/${targetCurrency}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('convertedPrice');
    });
  });

  it('should update the stock and price of a book by ID', () => {
    const updatedData = { price: 24.99, stock: 30 };
    cy.request('PUT', `/api/books/sp/${bookId}`, updatedData).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
