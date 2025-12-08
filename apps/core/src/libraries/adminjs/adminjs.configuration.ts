// Here we can configure the look and feel of the admin panels:

// @ts-nocheck needed because they are mjs but we need only the types
import type { ResourceWithOptions } from 'adminjs';
// @ts-nocheck needed because they are mjs but we need only the types
import type RelationFeatures from '@adminjs/relations';
import * as bcrypt from 'bcrypt';

export const defaultConfig = {};

const usersNavigation = {
  name: 'Users',
  icon: 'User',
};

const textarea = {
  type: 'textarea',
  props: {
    rows: 20,
  },
};

export function getOptions(
  passwordsFeature,
  componentLoader,
  relations: typeof RelationFeatures,
) {
  const Components = {
    //MyInput: componentLoader.add('MyInput', './my-input'),
    // other custom components
  };

  const sortUpdatedAt = {
    sort: {
      sortBy: 'updatedAt',
      direction: 'desc' as const,
    },
  };

  const resources: Record<string, Partial<ResourceWithOptions>> = {
    User: {
      titleProperty: 'name',
      options: {
        ...sortUpdatedAt,
        navigation: usersNavigation,
        listProperties: [
          'id',
          'name',
          'email',
          'createdAt',
          'deletedAt',
          'willDeleteAt',
        ],
      },
      features: [
        passwordsFeature({
          componentLoader,
          properties: {
            encryptedPassword: 'password',
            password: 'newPassword',
          },
          hash: (data) => bcrypt.hash(data, 10),
        }),
      ],
    },

    RefreshToken: {
      options: {
        navigation: usersNavigation,
      },
    },

    Organization: {
      titleProperty: 'name',
      ...sortUpdatedAt,
      options: {
        navigation: usersNavigation,
        editProperties: ['name'],
        actions: {
          new: {
            actionType: 'resource',
            after: async (originalResponse, request, context) => {
              // TODO: custom init org logic
              return originalResponse;
            },
          },
        },
      },
      features: [
        // PROBLEM: it doesn't work because we also need to set the Role:
        /*relations.owningRelationSettingsFeature({
          componentLoader,
          licenseKey: process.env.ADMINJS_LICENSE_KEY,
          relations: {
            members: {
              type: relations.RelationType.OneToMany,
              target: {
                joinKey: 'globalSettings',
                resourceId: 'GlobalSettings',
              },
            },
          },
        }),*/
      ],
    },
    EnumRole: {
      ...sortUpdatedAt,
      options: {
        navigation: usersNavigation,
      },
    },
    UserOnOrganization: {
      ...sortUpdatedAt,
      options: {
        navigation: usersNavigation,
        properties: {
          id: {
            isVisible: false,
          },
        },
      },
    },
  };

  // Don't allow deleting any record for now:
  /*for (const resource in resources) {
    if (resources.hasOwnProperty(resource)) {
      if (!resources[resource]?.options?.actions?.delete) {
        resources[resource].options = {
          ...resources[resource].options,
          actions: {
            delete: {
              isAccessible: false,
              isVisible: false,
            },
          },
        };
      }
    }
  }*/

  return resources;
}
