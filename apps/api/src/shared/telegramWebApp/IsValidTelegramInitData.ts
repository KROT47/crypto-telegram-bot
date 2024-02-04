import { validate } from '@tma.js/init-data-node';
import { parseInitData } from '@tma.js/sdk';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsValidTelegramInitData(
  telegramBotTokenGetter: () => string,
  validationOptions: ValidationOptions = { message: 'Can not authorize' }
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsValidTelegramInitData',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const telegramBotToken = telegramBotTokenGetter();

          try {
            validate(value, telegramBotToken);
          } catch (e) {
            return false;
          }

          const data = parseInitData(value);

          const id = data.user?.id;

          return id !== undefined;
        },
      },
    });
  };
}
