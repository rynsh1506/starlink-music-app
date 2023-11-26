import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  isArray,
  isBooleanString,
  isDateString,
  isNumberString,
  isObject,
  isString,
} from 'class-validator';

@Injectable()
export class PrismaFunction {
  private enumField: string[] = [];

  parseQuery(query: any) {
    const parseRes = {};
    Object.keys(query).map((key) => {
      if (query == '' || query == 'undefined') {
        parseRes[key] = undefined;
        return;
      }
      if (query == 'null') {
        parseRes[key] = null;
        return;
      }
      if (isObject(query[key])) {
        parseRes[key] = this.parseQuery(query[key]);
        return;
      }
      parseRes[key] = query[key];
    });
    return parseRes;
  }

  parseString(key, value: string) {
    if (value == '' || value == 'undefined') {
      return undefined;
    }

    if (value == 'null') {
      return null;
    }

    if (isNumberString(value)) {
      return Number.parseFloat(value);
    }

    if (isBooleanString(value)) {
      if (value == 'true') {
        return true;
      } else {
        return false;
      }
    }

    if (isDateString(value)) {
      return new Date(value);
    }

    if (this.enumField?.includes(key)) {
      return {
        in: value,
      };
    } else {
      return {
        contains: value,
        mode: Prisma.QueryMode.insensitive,
      };
    }
  }

  parseObject(key: string, query: any) {
    const specialFunction = ['gt', 'gte', 'lt', 'lte'];

    switch (typeof query) {
      case 'string':
        if (specialFunction.includes(key) && query == 'now') {
          return new Date(Date.now() + 7 * 60 * 60 * 1000);
        }

        return this.parseString(key, query);
      case 'object':
        if (isArray(query)) {
          return this.formatArrayObject(key, query);
        } else {
          return this.formatWhereQueryObject(query);
        }
      default:
        return query[key];
    }
  }

  formatSpecial(query: any) {
    const specialQuery = [];

    Object.keys(query).map((key) => {
      if (isArray(query[key])) {
        specialQuery.push(...this.parseObject(key, query[key]));
      } else {
        specialQuery.push({ [key]: this.parseObject(key, query[key]) });
      }
    });

    return specialQuery;
  }

  formatArrayObject(key: string, query: Array<any>) {
    const arrayObject = [];

    query.map((object) => {
      arrayObject.push({ [key]: this.parseObject(key, object) });
    });

    return arrayObject;
  }

  formatWhereQueryObject(query: any) {
    const specialFunction = ['gt', 'gte', 'lt', 'lte'];
    const specialProcess = ['AND', 'OR', 'BETWEEN'];
    const whereObject = {};

    Object.keys(query).map((key) => {
      if (specialFunction.includes(key.toLowerCase())) {
        if (isString(query[key])) {
          if (query[key].toLowerCase() === 'now') {
            whereObject[key] = new Date(Date.now() + 7 * 60 * 60 * 1000);
            return;
          }
        }
        whereObject[key.toLowerCase()] = this.parseString(key, query[key]);

        return;
      }

      switch (typeof query[key]) {
        case 'string':
          whereObject[key] = this.parseString(key, query[key]);
          break;
        case 'object':
          if (isArray(query[key])) {
            let objName = 'OR';
            if (specialProcess.includes(key.toUpperCase())) {
              objName = key.toUpperCase();
              whereObject[objName] = this.formatSpecial(query[key]);
            } else {
              whereObject[objName] = this.formatArrayObject(key, query[key]);
            }
          } else {
            if (specialProcess.includes(key.toUpperCase())) {
              const objName = key.toUpperCase();
              whereObject[objName] = this.formatSpecial(query[key]);
            } else {
              whereObject[key] = this.formatWhereQueryObject(query[key]);
            }
          }
          break;
        default:
          whereObject[key] = query[key];
          break;
      }
    });

    return whereObject;
  }

  createFilter(
    query: any,
    options: { enumField: string[] } = { enumField: [] },
  ) {
    if (options.enumField) {
      this.enumField = options.enumField;
    }

    const takeCeil = 50;
    let take = 10;
    let skip = 0;
    let orderBy = undefined;
    const where = {};
    const specialParam = ['limit', 'page', 'sort'];
    const specialFunction = ['AND', 'OR', 'BETWEEN'];
    const queryParam = this.parseQuery(query);

    Object.keys(queryParam).map((key) => {
      if (specialParam.includes(key.toLowerCase())) {
        switch (key.toLowerCase()) {
          case 'limit':
            let limitInput = Number.parseInt(queryParam[key]);
            if (limitInput > takeCeil) {
              limitInput = takeCeil;
            }
            take = limitInput;
            return;
          case 'page':
            const page = queryParam[key];
            skip = take * (page - 1);
            return;
          case 'sort':
            orderBy = queryParam[key];
            return;
          default:
            return;
        }
      }

      if (specialFunction.includes(key.toUpperCase())) {
        where[key.toUpperCase()] = this.formatSpecial(query[key]);
        return;
      }

      switch (typeof queryParam[key]) {
        case 'string':
          where[key] = this.parseString(key, queryParam[key]);
          break;
        case 'object':
          if (isArray(queryParam[key])) {
            where['OR'] = this.formatArrayObject(key, queryParam[key]);
          } else {
            where[key] = this.formatWhereQueryObject(queryParam[key]);
          }
          break;
        default:
          where[key] = queryParam[key];
          break;
      }

      return;
    });

    return { skip, take, where, orderBy };
  }
}
