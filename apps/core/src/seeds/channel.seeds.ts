import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { Seeds } from '@repo/system/test/seeds.interface';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { DbService } from '../libraries/db/db.service';

@Injectable()
export class ChannelSeeds implements Seeds {
  constructor(private db: DbService) {}

  mainChannel: Channel;
  disabledChannel: Channel;
  techChannel: Channel;
  politicsChannel: Channel;
  aiChannel: Channel;
  webdevChannel: Channel;

  async seed(): Promise<void> {
    await this.createChannels();
  }

  async createChannels() {
    // Create main categories
    this.mainChannel = await this.db.channel.create({
      data: {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'General',
        isEnabled: true,
      },
    });

    this.disabledChannel = await this.db.channel.create({
      data: {
        id: '11111111-1111-1111-1111-111111111112',
        name: 'Disabled Channel',
        isEnabled: false,
      },
    });

    this.techChannel = await this.db.channel.create({
      data: {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Technology',
        isEnabled: true,
      },
    });

    this.politicsChannel = await this.db.channel.create({
      data: {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Politics',
        isEnabled: true,
      },
    });

    // Create sub-channels under Technology
    this.aiChannel = await this.db.channel.create({
      data: {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Artificial Intelligence',
        isEnabled: true,
        parentChannelId: this.techChannel.id,
      },
    });

    this.webdevChannel = await this.db.channel.create({
      data: {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'Web Development',
        isEnabled: true,
        parentChannelId: this.techChannel.id,
      },
    });
  }

  async seedExtended(): Promise<void> {
    const csvPath = path.join(__dirname, 'data', 'channels.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const parentChannels = new Map<string, Channel>();
    let currentCategory = '';

    for (const record of records as any[]) {
      const { name, category, public_id: iconPublicId } = record;

      // If category changes, create a new parent channel
      if (category !== currentCategory) {
        currentCategory = category;

        // Check if parent channel exists, create only if missing
        let parentChannel = await this.db.channel.findFirst({
          where: { name, parentChannelId: null },
        });

        if (!parentChannel) {
          parentChannel = await this.db.channel.create({
            data: {
              name,
              iconPublicId,
              isEnabled: true,
            },
          });
        }

        parentChannels.set(category, parentChannel);
      } else {
        // Check if child channel exists, create only if missing
        const parentChannel = parentChannels.get(category);
        if (!parentChannel) continue;

        const existingChannel = await this.db.channel.findFirst({
          where: { name, parentChannelId: parentChannel.id },
        });

        if (!existingChannel) {
          await this.db.channel.create({
            data: {
              name,
              iconPublicId,
              isEnabled: true,
              parentChannelId: parentChannel.id,
            },
          });
        }
      }
    }
  }
}
