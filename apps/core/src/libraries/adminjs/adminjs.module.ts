/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Module } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AdminService } from 'src/iam/admin/admin.service';
import { IamModule } from 'src/iam/iam.module';
import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { getOptions } from './adminjs.configuration';

//TODO: move this to the system package, using forRootAsync to pass the configs from each module
@Module({
  imports: [
    // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
    import('adminjs').then(({ default: AdminJS, ComponentLoader }) =>
      import('@adminjs/prisma').then(({ Database, Resource }) =>
        import('@adminjs/passwords').then(({ default: passwordsFeature }) =>
          import('@adminjs/relations').then((relations) =>
            import('@adminjs/nestjs').then(({ AdminModule }) => {
              AdminJS.registerAdapter({ Database, Resource });

              // Custom React components:
              const componentLoader = new ComponentLoader();

              const modelConfigs = getOptions(
                passwordsFeature,
                componentLoader,
                relations,
              );
              function getModel(model: any, prisma: DbService) {
                return {
                  resource: {
                    model,
                    client: prisma,
                  },

                  ...modelConfigs[model.name],
                };
              }

              function getResources(prisma: DbService) {
                //@ts-ignore
                const dmmf = Prisma.dmmf.datamodel;

                return dmmf.models.map((model) => {
                  // Patch the User model to exclude the profilePicture field because it's a FK to a column that's not the primary key, and this is not currently supported by AdminJS
                  if (model.name === 'User') {
                    const profilePicture = model.fields.find(
                      (field) => field.name === 'profilePicture',
                    );
                    if (profilePicture) {
                      // @ts-ignore
                      profilePicture.relationName = null;
                    }
                  }
                  return getModel(model, prisma);
                });
              }

              return AdminModule.createAdminAsync({
                imports: [IamModule, DbModule],
                inject: [AdminService, DbService],
                useFactory: (
                  adminService: AdminService,
                  prisma: DbService,
                ) => ({
                  adminJsOptions: {
                    rootPath: '/admin',
                    resources: getResources(prisma),
                    componentLoader,
                  },
                  auth: {
                    authenticate: async (email: string, password: string) => {
                      try {
                        const admin = await adminService.loginAdmin(
                          email,
                          password,
                        );
                        return {
                          email: admin.email,
                          role: admin.role,
                        };
                      } catch (error) {
                        console.log('error', error);
                        return;
                      }
                    },
                    cookieName: 'adminjs',
                    cookiePassword: 'secret',
                  },
                  sessionOptions: {
                    resave: true,
                    saveUninitialized: true,
                    secret: 'secret',
                  },
                }),
              });
            }),
          ),
        ),
      ),
    ),
  ],
})
export class AdminJsModule {}
