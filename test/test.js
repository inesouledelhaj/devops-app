
//Require the dev-dependencies
const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);


describe('Add ToDo', () => {
    it('it should add the task to tuesday', (done) => {
      chai.request(server)
          .get('/add-todo/tuesday/celebrate')
          .end((err, res) => {
                res.should.have.status(200);
                todos= JSON.parse(res.text);
                expect(todos['tuesday'].includes('celebrate')).to.be.true;
            done();
          });
    });
  });

describe('Delete ToDo', () => {
  it('it should delete the tasks of monday', (done) => {
    chai.request(server)
        .get('/delete-todo/monday')
        .end((err, res) => {
              res.should.have.status(200);
              todos= JSON.parse(res.text);
              expect(todos).to.not.have.property('monday');
          done();
        });
  });
});