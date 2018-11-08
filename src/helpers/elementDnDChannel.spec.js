import dndChannel, {MOVE} from './elementDnDChannel';

describe('ElementDndChannel', () => {
  // 각 컬럼의 아이디는 index
  beforeEach(() => {
    dndChannel.initDimension(
      {
        id: 'eId',
        parentId: 'pId'
      },
      {
        left: 20,
        top: 20,
        width: 10,
        height: 10
      }
    );
    [
      {
        left: 2,
        top: 3,
        right: 3,
        bottom: 4
      },
      {
        left: 5,
        top: 5,
        right: 7,
        bottom: 7
      },
      {
        left: 10,
        top: 10,
        right: 30,
        bottom: 30
      },
      {
        left: 40,
        top: 50,
        right: 60,
        bottom: 70
      }
    ].forEach((rect, idx) => {
      dndChannel.setColumnRect(idx, rect);
    });
  });

  describe('limitRect', () => {
    it('limitRect는 등록된 column들을 기준으로 지정된다.', () => {
      expect(dndChannel.limitRect).toEqual({
        left: 2,
        top: 3,
        right: 60,
        bottom: 70
      });
    });
  });

  describe('setDimension', () => {
    it('left, top 기준으로 해당되는 영역의 컬럼 아이디를 반환한다.', () => {
      dndChannel.setDimension({
        left: 50,
        top: 65
      });

      expect(dndChannel.currentColumnId).toBe('3');
    });

    it('left, top 기준으로 제한 영역을 벗어난 경우 제한 영역까지만 이동한다.', () => {
      dndChannel.setDimension({
        left: 150,
        top: 1000
      });

      expect(dndChannel.currentColumnId).toBe('3');
      expect(dndChannel.dimension).toEqual({
        left: 50,
        top: 60,
        width: 10,
        height: 10,
        fixedRatio: null
      });
    });
  });

  describe('이동 동작', () => {
    it('Grab에서 마우스의 clientX, clientY 좌표를 shiftX, shiftY를 계산한다.', () => {
      dndChannel.initDimension(
        {
          id: 'eId',
          parentId: 'pId'
        },
        {
          left: 20,
          top: 20,
          width: 10,
          height: 10
        }
      );
      dndChannel.grab({clientX: 25, clientY: 25}, MOVE);

      expect(dndChannel.shiftX).toBe(5);
      expect(dndChannel.shiftY).toBe(5);
    });

    it('clinetX, clientY 기준으로 이동해 해당되는 영역의 컬럼 아이디를 반환한다.', () => {
      dndChannel.grab({clientX: 25, clientY: 25}, MOVE);
      dndChannel._handleMouseMove({
        clientX: 50,
        clientY: 65
      });

      expect(dndChannel.currentColumnId).toBe('3');
    });

    it('clinetX, clientY 기준으로 이동해 제한 영역을 벗어난 경우 제한 영역까지만 이동한다.', () => {
      dndChannel.grab({clientX: 25, clientY: 25}, MOVE);
      dndChannel._handleMouseMove({
        clientX: 70,
        clientY: 120
      });

      expect(dndChannel.currentColumnId).toBe('3');
      expect(dndChannel.dimension).toEqual({
        left: 50,
        top: 60,
        width: 10,
        height: 10,
        fixedRatio: null
      });
    });
  });
});
