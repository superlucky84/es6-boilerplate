import {getGlobalOptions, setGlobalOptions, mapGlobalOptionFunctions, mapGlobalOptionData} from './globalOptions';

describe('GlobalOptions', () => {
  it('should set and get options', () => {
    setGlobalOptions({
      someData1: 'data1',
      someUnusedData2: 'data2',
      fetchImageList() {
        return 'OK';
      }
    });

    const pickedOptions = getGlobalOptions(['fetchImageList', 'someData1']);

    expect(pickedOptions.fetchImageList()).toEqual('OK');
    expect(pickedOptions.someData1).toEqual('data1');
  });

  it('map function options for spread', () => {
    const map = mapGlobalOptionFunctions(['myfunc', 'myfunc2']);

    setGlobalOptions({
      myfunc: () => {
        return 'OK';
      },
      myfunc2: () => {
        return 'OK2';
      }
    });

    expect(map.myfunc()).toEqual('OK');
    expect(map.myfunc2()).toEqual('OK2');
  });

  it('map data options for spread', () => {
    const map = mapGlobalOptionData(['myData', 'myData2']);

    setGlobalOptions({
      myData: 'OK',
      myData2: 'OK2'
    });

    expect(map.myData()).toEqual('OK');
    expect(map.myData2()).toEqual('OK2');
  });
});
