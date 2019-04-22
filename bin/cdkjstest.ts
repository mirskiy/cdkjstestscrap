#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { CdkjstestStack } from '../lib/cdkjstest-stack';

const app = new cdk.App();
new CdkjstestStack(app, 'CdkjstestStack');
