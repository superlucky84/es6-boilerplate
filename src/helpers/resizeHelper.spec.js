import {
  adjustRatioSize,
  resizeTL,
  resizeT,
  resizeTR,
  resizeR,
  resizeBR,
  resizeB,
  resizeBL,
  resizeL
} from '@/helpers/resizeHelper';

describe('resizeHelper', () => {
  const limitRect = {
    left: 0,
    top: 0,
    right: 1000,
    bottom: 1000
  };

  describe('adjustRatioSize - ', () => {
    it('기본 Scale 동작은 세로 기준이다. - 가로 이미지 (Scale down)', () => {
      const adjusted = adjustRatioSize({width: 200, height: 200, fixedRatio: 0.5, maxHeight: 1000, maxWidth: 1000});
      expect(adjusted).toEqual({
        width: 100,
        height: 200
      });
    });

    it('기본 Scale 동작은 동작은 세로 기준이다. - 가로 이미지 (Scale up)', () => {
      const adjusted = adjustRatioSize({width: 200, height: 200, fixedRatio: 2, maxHeight: 1000, maxWidth: 1000});
      expect(adjusted).toEqual({
        width: 400,
        height: 200
      });
    });

    it('ScaleTo: width - width 기준으로 동작한다.', () => {
      const adjusted = adjustRatioSize({
        width: 200,
        height: 200,
        fixedRatio: 2,
        scaleTo: 'width',
        maxHeight: 1000,
        maxWidth: 1000
      });

      expect(adjusted).toEqual({
        width: 200,
        height: 100
      });
    });

    it('ScaleTo: height - height 기준으로 동작한다.', () => {
      const adjusted = adjustRatioSize({
        width: 200,
        height: 200,
        fixedRatio: 2,
        scaleTo: 'height',
        maxHeight: 1000,
        maxWidth: 1000
      });

      expect(adjusted).toEqual({
        width: 400,
        height: 200
      });
    });
  });

  describe('TopLeft', () => {
    it('리사이즈', () => {
      const resized = resizeTL({left: 100, top: 100, width: 100, height: 100}, {pageX: 50, pageY: 50}, limitRect);

      expect(resized).toEqual({
        left: 50,
        top: 50,
        width: 150,
        height: 150
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeTL(
        {left: 200, top: 200, width: 100, height: 100, fixedRatio: 2},
        {pageX: 150, pageY: 150},
        limitRect
      );

      expect(resized).toEqual({
        left: 0,
        top: 150,
        width: 300,
        height: 150
      });
    });

    it('LimitRect에 걸린 경우 ("Left === 0"에서 크기가 더 커지지 않는다.)', () => {
      const resized = resizeTL(
        {left: 100, top: 100, width: 100, height: 100, fixedRatio: 2},
        {pageX: 50, pageY: 50},
        limitRect
      );

      expect(resized).toEqual({
        left: 0,
        top: 100,
        width: 200,
        height: 100
      });
    });
  });

  describe('Top', () => {
    it('리사이즈', () => {
      const resized = resizeT({left: 100, top: 100, width: 100, height: 100}, {pageY: 50}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 50,
        width: 100,
        height: 150
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeT({left: 100, top: 100, width: 100, height: 100, fixedRatio: 2}, {pageY: 50}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 50,
        width: 300,
        height: 150
      });
    });

    it('LimitRect에 걸린 경우 ("Left + Width === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeT({left: 800, top: 100, width: 100, height: 50, fixedRatio: 2}, {pageY: 0}, limitRect);

      expect(resized).toEqual({
        left: 800,
        top: 50,
        width: 200,
        height: 100
      });
    });
  });

  describe('Top Right', () => {
    it('리사이즈', () => {
      const resized = resizeTR({left: 100, top: 100, width: 100, height: 100}, {pageX: 250, pageY: 50}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 50,
        width: 150,
        height: 150
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeTR(
        {left: 100, top: 100, width: 100, height: 100, fixedRatio: 2},
        {pageX: 250, pageY: 50},
        limitRect
      );

      expect(resized).toEqual({
        left: 100,
        top: 50,
        width: 300,
        height: 150
      });
    });

    it('LimitRect에 걸린 경우 ("Left + Width === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeTR(
        {left: 800, top: 100, width: 100, height: 50, fixedRatio: 2},
        {pageX: 1000, pageY: 0},
        limitRect
      );

      expect(resized).toEqual({
        left: 800,
        top: 50,
        width: 200,
        height: 100
      });
    });
  });

  describe('Right', () => {
    it('리사이즈', () => {
      const resized = resizeR({left: 100, top: 100, width: 100, height: 100}, {pageX: 250}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 100,
        width: 150,
        height: 100
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeR({left: 100, top: 100, width: 100, height: 100, fixedRatio: 2}, {pageX: 250}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 100,
        width: 150,
        height: 75
      });
    });

    it('LimitRect에 걸린 경우 ("Top + Height === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeR({left: 100, top: 800, width: 100, height: 50, fixedRatio: 2}, {pageX: 1000}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 800,
        width: 400,
        height: 200
      });
    });
  });

  describe('BottomRight', () => {
    it('리사이즈', () => {
      const resized = resizeBR({left: 100, top: 100, width: 100, height: 100}, {pageX: 250, pageY: 300}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 100,
        width: 150,
        height: 200
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeBR(
        {left: 100, top: 100, width: 100, height: 100, fixedRatio: 2},
        {pageX: 250, pageY: 300},
        limitRect
      );

      expect(resized).toEqual({
        left: 100,
        top: 100,
        width: 400,
        height: 200
      });
    });

    it('LimitRect에 걸린 경우 ("Top + Height === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeBR(
        {left: 100, top: 800, width: 100, height: 50, fixedRatio: 2},
        {pageX: 1200, pageY: 1200},
        limitRect
      );

      expect(resized).toEqual({
        left: 100,
        top: 800,
        width: 400,
        height: 200
      });
    });
  });

  describe('Bottom', () => {
    it('리사이즈', () => {
      const resized = resizeB({left: 100, top: 100, width: 100, height: 100}, {pageY: 300}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 100,
        width: 100,
        height: 200
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeB({left: 100, top: 100, width: 100, height: 100, fixedRatio: 2}, {pageY: 300}, limitRect);

      expect(resized).toEqual({
        left: 100,
        top: 100,
        width: 400,
        height: 200
      });
    });

    it('LimitRect에 걸린 경우 ("Left + Width === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeB({left: 800, top: 100, width: 100, height: 50, fixedRatio: 2}, {pageY: 1200}, limitRect);

      expect(resized).toEqual({
        left: 800,
        top: 100,
        width: 200,
        height: 100
      });
    });
  });

  describe('BottomLeft', () => {
    it('리사이즈', () => {
      const resized = resizeBL({left: 100, top: 100, width: 100, height: 100}, {pageX: 50, pageY: 300}, limitRect);

      expect(resized).toEqual({
        left: 50,
        top: 100,
        width: 150,
        height: 200
      });
    });

    it('리사이즈 + 비욜 고정', () => {
      const resized = resizeBL(
        {left: 100, top: 100, width: 200, height: 100, fixedRatio: 2},
        {pageX: 50, pageY: 300},
        limitRect
      );

      expect(resized).toEqual({
        left: 0,
        top: 100,
        width: 300,
        height: 150
      });
    });

    it('LimitRect에 걸린 경우 ("Top + Height === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeBL(
        {left: 800, top: 800, width: 100, height: 50, fixedRatio: 2},
        {pageX: 0, pageY: 800},
        limitRect
      );

      expect(resized).toEqual({
        left: 500,
        top: 800,
        width: 400,
        height: 200
      });
    });
  });

  describe('Left', () => {
    it('TopLeft 리사이즈', () => {
      const resized = resizeL({left: 100, top: 100, width: 100, height: 100}, {pageX: 50}, limitRect);

      expect(resized).toEqual({
        left: 50,
        top: 100,
        width: 150,
        height: 100
      });
    });

    it('TopLeft 리사이즈 + 비욜 고정', () => {
      const resized = resizeL({left: 100, top: 100, width: 100, height: 100, fixedRatio: 2}, {pageX: 50}, limitRect);

      expect(resized).toEqual({
        left: 50,
        top: 100,
        width: 150,
        height: 75
      });
    });

    it('LimitRect에 걸린 경우 ("Top + Height === 1000"에서 크기가 커지지 않는다.)', () => {
      const resized = resizeL({left: 800, top: 800, width: 100, height: 50, fixedRatio: 2}, {pageX: 0}, limitRect);

      expect(resized).toEqual({
        left: 500,
        top: 800,
        width: 400,
        height: 200
      });
    });
  });
});
