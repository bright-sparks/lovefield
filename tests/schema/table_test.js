/**
 * @license
 * Copyright 2014 The Lovefield Project Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
goog.setTestOnly();
goog.require('goog.testing.jsunit');
goog.require('hr.db');
goog.require('lf.testing.hrSchema.getSchemaBuilder');


function testAlias_StaticSchema() {
  checkAlias(hr.db.getSchema(), false);
}


function testAlias_DynamicSchema() {
  checkAlias(lf.testing.hrSchema.getSchemaBuilder().getSchema(), true);
}


/**
 * @param {!lf.schema.Database} schema
 * @param {boolean} checkForeignKeys
 */
function checkAlias(schema, checkForeignKeys) {
  var noAliasTable = schema.table('Job');
  var name = noAliasTable.getName();
  var alias = 'OtherJob';
  var aliasTable = noAliasTable.as(alias);

  assertTrue(noAliasTable != aliasTable);

  // Assertions about original instance.
  assertNull(noAliasTable.getAlias());
  assertEquals(name, noAliasTable.getName());
  assertEquals(name, noAliasTable.getEffectiveName());

  // TODO(dpapad): Remove this check once foreign-keys are fully implemented for
  // SPAC schemas.
  if (checkForeignKeys) {
    var referencingForeignKeys = noAliasTable.getReferencingForeignKeys();
    assertEquals(1, referencingForeignKeys.length);
    assertEquals('Employee.fk_JobId', referencingForeignKeys[0].fkName);
  }

  // Assertions about aliased instance.
  assertEquals(alias, aliasTable.getAlias());
  assertEquals(name, aliasTable.getName());
  assertEquals(alias, aliasTable.getEffectiveName());
  assertEquals(noAliasTable.constructor, aliasTable.constructor);

  // TODO(dpapad): See previous TODO.
  if (checkForeignKeys) {
    referencingForeignKeys = aliasTable.getReferencingForeignKeys();
    assertEquals(1, referencingForeignKeys.length);
    assertEquals('Employee.fk_JobId', referencingForeignKeys[0].fkName);
  }
}
