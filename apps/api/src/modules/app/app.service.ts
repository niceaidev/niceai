import { HumanMessage, type SystemMessage } from '@langchain/core/messages';
import { Injectable } from '@nestjs/common';

import 'langchain/agents';

import { ChatOpenAI } from '@langchain/openai';

import type { CreateAppDto } from './dto/create-app.dto';
import type { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class AppService {
  create(createAppDto: CreateAppDto) {
    return 'This action adds a new app';
  }

  findAll() {
    return 'This action returns all app';
  }

  findOne(id: number) {
    return `This action returns a #${id} app`;
  }

  update(id: number, updateAppDto: UpdateAppDto) {
    return `This action updates a #${id} app`;
  }

  remove(id: number) {
    return `This action removes a #${id} app`;
  }

  async chatMessage(id: number, message: string) {
    const model = new ChatOpenAI({
      apiKey: 'sk-uuAIrOUVGw4yJJGO6405805dB27f4371AdDc46C62c504508',
      modelName: 'claude-3-sonnet-20240229',
    });

    const messages: (HumanMessage | SystemMessage)[] = [
      // new SystemMessage(systemPrompt),
      new HumanMessage('Hello world!'),
    ];

    const response = await model.invoke(messages);
    const stringResponse = response.content as string;

    return stringResponse;
  }
}
