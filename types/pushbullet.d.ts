declare module 'pushbullet' {
  class PushBullet {
    constructor(apiKey: string);

    devices(
      options?: Object,
      callback?: (error: any, response: any) => any
    ): any;
    note(
      deviceParams: string,
      noteTitle: string,
      noteBody: string,
      callback?: (error: any, response: any) => any
    ): any;
    file(
      deviceParams: string,
      filePath: string,
      message: string,
      callback?: (error: any, response: any) => any
    ): any;
  }
  export = PushBullet;
}
