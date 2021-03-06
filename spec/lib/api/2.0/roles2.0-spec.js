// Copyright 2016, EMC, Inc.
/* jshint node:true */

'use strict';

describe('Http.Api.Roles', function () {
    var roleObj = {
        role: 'admin-role',
        privileges: ['write', 'read']
    };

    var newRole = {
        role: 'read-role',
        privileges: ['read']
    };

    var accountService;

    helper.httpServerBefore();

    beforeEach('set up mocks', function () {
        accountService = helper.injector.get('Http.Services.Api.Account');
        this.sandbox.stub(accountService, 'listRoles').resolves([roleObj]);
        this.sandbox.stub(accountService, 'getRoleByName').resolves(newRole);
        this.sandbox.stub(accountService, 'createRole').resolves(newRole);
        this.sandbox.stub(accountService, 'modifyRoleByRoleName').resolves(newRole);
        this.sandbox.stub(accountService, 'removeRoleByName').resolves();
    });

    helper.httpServerAfter();

    it('should return a list of roles', function () {
        return helper.request().get('/api/2.0/roles')
            .expect('Content-Type', /^application\/json/)
            .expect(200, [roleObj]);
    });

    it('should return the info of the created role', function () {
        return helper.request().post('/api/2.0/roles')
            .send(newRole)
            .expect('Content-Type', /^application\/json/)
            .expect(201, newRole);
    });

    it('should return the info of selected role', function () {
        return helper.request().get('/api/2.0/roles/' + newRole.role)
            .expect('Content-Type', /^application\/json/)
            .expect(200, newRole);
    });

    it('should return 200 when modified a  selected role', function () {
        return helper.request().patch('/api/2.0/roles/' + newRole.role)
            .send(newRole)
            .expect(200, newRole);
    });

    it('should return 204 when removing a  selected role', function () {
        return helper.request().delete('/api/2.0/roles/' + newRole.role)
            .expect(204);
    });
});
