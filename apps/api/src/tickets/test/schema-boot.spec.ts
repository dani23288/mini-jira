import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { TicketsResolver } from '../tickets.resolver';

// Regression check for the bare-@Field()-on-string-union crash: schema build used to throw
// "Undefined type error" at boot because design:type reflects string-literal unions as Object.
describe('GraphQL schema build', () => {
  it('builds the schema from TicketsResolver without throwing', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GraphQLSchemaBuilderModule],
    }).compile();
    const schemaFactory = moduleRef.get(GraphQLSchemaFactory);

    const schema = await schemaFactory.create([TicketsResolver]);

    expect(schema).toBeDefined();
  });
});
