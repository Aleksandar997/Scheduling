import { BehaviorSubject } from 'rxjs';

export class CacheService {

  private static data = new Map<string, CacheItem>();
  // 60 minutes
  private static defaultExpiration = 60;
  // static sessionData = () => new SessionData();
  static set(key: string, item: any, minutesExpiration: number = this.defaultExpiration) {
    const cacheItem = this.getItem(key);
    if (cacheItem) {
      cacheItem.item.next(item);
      return;
    }
    this.data.set(key, new CacheItem(item, minutesExpiration));
  }

  static getObservable(key: string) {
    const res = this.getItem(key);
    if (!res || !res.item.value) {
      this.data.set(key, new CacheItem(null, this.defaultExpiration));
      return this.getItem(key).item.asObservable();
    }
    return res.item.asObservable();
  }

  static get(key: string) {
    const cacheItem = this.getItem(key);
    return cacheItem ? cacheItem.item.value : null;
  }

  static delete(key: string) {
    if (key.includes('%')) {
      const keys = Array.from( this.data.keys() ).filter(x => x.startsWith(key));
      keys.forEach(k => this.data.delete(k));
    }
    this.data.delete(key);
  }

  private static getItem(key: string): CacheItem {
    const item = this.data.get(key);
    if (!item) {
      return null;
    }
    if (new Date() > item.expirationDate && item.item.value) {
      this.data.delete(key);
      return null;
    }
    return item;
  }
}
// class SessionData {
//   private static data = new Map<string, CacheItem>();
//   private get = (key: string) => SessionData.data.get(key);
//   private set = (key: string, data: any) => SessionData.data.set(key, data);
//   setData(key: string, item: any) {
//     const cacheItem = this.get(key);
//     if (cacheItem) {
//       cacheItem.item.next(item);
//       sessionStorage.setItem(key, JSON.stringify(item));
//       return;
//     }
//     this.set(key, new CacheItem(item));
//     sessionStorage.setItem(key, JSON.stringify(item));
//   }

//   pushData(key: string, item: any) {
//     const cacheItem = this.get(key);
//     if (cacheItem) {
//       (cacheItem.item.value as Array<any>).push(item);
//       cacheItem.item.next(cacheItem.item.value);
//       sessionStorage.setItem(key, JSON.stringify(cacheItem.item.value));
//       return;
//     }
//     this.set(key, new CacheItem(item));
//     sessionStorage.setItem(key, JSON.stringify(item));
//   }

//   addProp(key: string, item: any) {
//     const cacheItem = this.get(key);
//     if (cacheItem) {
//       const objKey = Object.keys(item)[0];
//       cacheItem.item.value[objKey] = item[objKey];
//       cacheItem.item.next(cacheItem.item.value);
//       sessionStorage.setItem(key, JSON.stringify(cacheItem.item.value));
//       return;
//     }
//     this.set(key, new CacheItem(item));
//     sessionStorage.setItem(key, JSON.stringify(item));
//   }

//   getData(key: string) {
//     const res = this.get(key);
//     console.log(res)
//     return res ? res.item.value : sessionStorage.getItem(key);
//   }

//   getDataObservable(key: string): Observable<any> {
//     const res = this.get(key);
//     if (!res) {
//       const resSession = JSON.parse(sessionStorage.getItem(key));
//       this.set(key, resSession ? new CacheItem(resSession) : new CacheItem(null));
//       return (this.get(key) as CacheItem).item.asObservable();
//     }
//     return res.item.asObservable();
//   }
// }

class CacheItem {
  item: BehaviorSubject<any>;
  expirationDate: Date;

  constructor(value?: any, expiration?: number) {
    this.item = new BehaviorSubject(value);
    this.expirationDate = new Date();
    this.expirationDate.setTime(this.expirationDate.getTime() + (expiration * 60 * 1000));
  }
}
