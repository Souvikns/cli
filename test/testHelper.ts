import { existsSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import * as path from 'path';

import { IContextFile, DEFAULT_CONTEXT_FILE_PATH } from '../src/models/Context';
import SpecificationFile from '../src/models/SpecificationFile';

const ASYNCAPI_FILE_PATH = path.resolve(process.cwd(), 'asyncapi.yaml');

export default class ContextTestingHelper {
  private _context: IContextFile;
  constructor() {
    const homeSpecFile = new SpecificationFile(path.resolve(__dirname, 'specification.yml'));

    const codeSpecFile = new SpecificationFile(path.resolve(__dirname, 'specification.yml'));
    this._context = {
      current: 'home',
      store: {
        home: homeSpecFile.getPath(),
        code: codeSpecFile.getPath()
      }
    };
  }

  get context(): IContextFile {
    return this._context;
  }

  createDummyContextFile(): void {
    writeFileSync(DEFAULT_CONTEXT_FILE_PATH, JSON.stringify(this._context), { encoding: 'utf-8' });
  }

  deleteDummyContextFile(): void {
    if (existsSync(DEFAULT_CONTEXT_FILE_PATH)) { unlinkSync(DEFAULT_CONTEXT_FILE_PATH); }
  }

  unsetCurrentContext(): void {
    delete this._context.current;
  }

  setCurrentContext(context: string): void {
    this._context.current = context;
  }

  getPath(key: string): string | undefined {
    return this._context.store[String(key)];
  }

  createAsyncapiFile(fileName: string, template: string): void {
    const filePath = path.resolve(process.cwd(), fileName);
    const templatePath = path.resolve(__dirname, template);
    writeFileSync(filePath, readFileSync(templatePath, { encoding: 'utf-8' }), { encoding: 'utf-8' });
  }

  createSpecFileAtWorkingDir(): void {
    if (!existsSync(ASYNCAPI_FILE_PATH)) {
      writeFileSync(ASYNCAPI_FILE_PATH, '');
    }
  }

  deleteSpecFileAtWorkingDir(): void {
    if (existsSync(ASYNCAPI_FILE_PATH)) {
      unlinkSync(ASYNCAPI_FILE_PATH);
    }
  }
}
