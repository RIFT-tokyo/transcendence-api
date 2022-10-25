import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { PrivateMessageUser } from 'src/entities/private-message-user.entity';
import { PrivateMessage } from 'src/entities/private-message.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class PmsService {
  constructor(
    @InjectRepository(PrivateMessage)
    private readonly privateMessageRepository: Repository<PrivateMessage>,
    @InjectRepository(PrivateMessageUser)
    private readonly privateMessageUserRepository: Repository<PrivateMessageUser>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async findAllPrivateMessages(fromUserId: number, toUserId: number) {
    return await this.privateMessageRepository.find({
      relations: ['from_user', 'message'],
      where: [
        {
          from_user: { id: fromUserId },
          to_user: { id: toUserId },
        },
        {
          from_user: { id: toUserId },
          to_user: { id: fromUserId },
        },
      ],
    });
  }

  async findPrivateMessageUserById(userId: number) {
    return await this.privateMessageUserRepository.findOne({
      relations: ['to_users'],
      where: { from_user: { id: userId } },
    });
  }

  // ・createMessageで呼ばれる ・ユーザーステータスリストのDMアイコン押した時に呼ばれる
  async findOrCreatePrivateMessageUser(fromUserId: number, toUserId: number) {
    const fromUser = await this.usersService.findUserById(fromUserId);
    const toUser = await this.usersService.findUserById(toUserId);

    // fromUserのprivateMessageUser探す
    // -> あったらそれを使う　なかったら新しく作る
    let fromUserPrivateMessageUser = await this.findPrivateMessageUserById(
      fromUserId,
    );
    if (!fromUserPrivateMessageUser) {
      const newFromUserPrivateMessageUser = new PrivateMessageUser();
      newFromUserPrivateMessageUser.to_users = [];
      newFromUserPrivateMessageUser.from_user = fromUser;
      fromUserPrivateMessageUser = newFromUserPrivateMessageUser;
    }
    // そこのto_usersにtoUserがいなかったらaddする
    if (
      fromUserPrivateMessageUser.to_users.findIndex(
        (user) => user.id === toUserId,
      ) === -1
    ) {
      fromUserPrivateMessageUser.to_users = [
        ...fromUserPrivateMessageUser.to_users,
        toUser,
      ];
    }
    // privateMessageUserを返す
    await this.privateMessageUserRepository.save(fromUserPrivateMessageUser);
    return toUser;
  }

  async createMessage(fromUserId: number, toUserId: number, text: string) {
    const fromUser = await this.usersService.findUserById(fromUserId);
    const toUser = await this.usersService.findUserById(toUserId);

    // toUser側のPrivateMessageUserのto_usersにfromUserがいなかったら追加してやる
    await this.findOrCreatePrivateMessageUser(toUserId, fromUserId);

    const message = new Message();
    message.text = text;
    const savedMessage = await this.messageRepository.save(message);

    const privateMessage = new PrivateMessage();
    privateMessage.from_user = fromUser;
    privateMessage.to_user = toUser;
    privateMessage.message = savedMessage;
    return await this.privateMessageRepository.save(privateMessage);
  }
}
