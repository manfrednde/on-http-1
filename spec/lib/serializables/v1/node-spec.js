// Copyright 2015, EMC, Inc.
/* jshint node:true */

'use strict';

describe('Node Serializable V1', function () {
    var encryption;
    var Serializable;

    helper.before(function () {
        return helper.requireGlob('/lib/serializables/**/*.js');
    });

    before(function () {
        encryption = helper.injector.get('Services.Encryption');
        Serializable = helper.injector.get('Serializables.V1.Node');
    });

    helper.after();

    describe('serialize', function () {
        beforeEach(function () {
            this.subject = new Serializable();
        });

        it('should assign defaults', function () {
            return this.subject.serialize({
                name: 'name'
            }).should.eventually.have.deep.property(
                'name'
            ).and.equal('name');
        });

        it('should redact obmSettings config password', function () {
            return this.subject.serialize({
                name: 'fake',
                obmSettings: [
                    {
                        service: 'fake-service',
                        config: {
                            password: encryption.encrypt('password')
                        }
                    }
                ]
            }).should.eventually.have.deep.property(
                'obmSettings[0].config.password'
            ).and.equal('REDACTED');
        });

        it('should redact obmSettings config community', function () {
            return this.subject.serialize({
                name: 'fake',
                obmSettings: [
                    {
                        service: 'fake-service',
                        config: {
                            community: encryption.encrypt('community')
                        }
                    }
                ]
            }).should.eventually.have.deep.property(
                'obmSettings[0].config.community'
            ).and.equal('REDACTED');
        });
    });

    describe('deserialize', function () {
        beforeEach(function () {
            this.subject = new Serializable();
        });

        it('should assign defaults', function () {
            return this.subject.deserialize({
                name: 'name'
            }).should.eventually.have.deep.property(
                'name'
            ).and.equal('name');
        });

        it('should encrypt obmSettings config password', function () {
            return this.subject.deserialize({
                name: 'fake',
                obmSettings: [
                    {
                        service: 'fake-service',
                        config: {
                            password: 'password'
                        }
                    }
                ]
            }).should.eventually.have.deep.property(
                'obmSettings[0].config.password'
            ).and.not.equal('password');
        });

        it('should encrypt obmSettings config community', function () {
            return this.subject.deserialize({
                name: 'fake',
                obmSettings: [
                    {
                        service: 'fake-service',
                        config: {
                            community: 'community'
                        }
                    }
                ]
            }).should.eventually.have.deep.property(
                'obmSettings[0].config.community'
            ).and.not.equal('community');
        });
    });
});
