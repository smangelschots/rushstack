// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { ITerminalProvider, Severity } from '../ITerminalProvider';
import { StringBuilder } from '../../StringBuilder';

/**
 * @beta
 */
export class StringBufferTerminalProvider implements ITerminalProvider {
  private _standardBuffer: StringBuilder = new StringBuilder();
  private _warningBuffer: StringBuilder = new StringBuilder();
  private _errorBuffer: StringBuilder = new StringBuilder();

  private _supportsColor: boolean;

  public constructor(supportsColor: boolean = false) {
    this._supportsColor = supportsColor;
  }

  public write(data: string, severity: Severity): void {
    switch (severity) {
      case Severity.warn: {
        this._warningBuffer.append(data);
        break;
      }

      case Severity.error: {
        this._errorBuffer.append(data);
        break;
      }

      case Severity.log:
      default: {
        this._standardBuffer.append(data);
        break;
      }
    }
  }

  public get width(): number | undefined {
    return process.stdout.columns;
  }

  public get supportsColor(): boolean {
    return this._supportsColor;
  }

  public getOutput(): string {
    return this._normalizeOutput(this._standardBuffer.toString());
  }

  public getErrorOutput(): string {
    return this._normalizeOutput(this._errorBuffer.toString());
  }

  public getWarningOutput(): string {
    return this._normalizeOutput(this._warningBuffer.toString());
  }

  private _normalizeOutput(s: string): string { // tslint:disable-line:export-name
    return s.replace(/\u001b/g, '[x]').replace(/\n/g, '[n]').replace(/\r/g, '[r]');
  }
}
