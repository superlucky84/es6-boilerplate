import * as doM from './doManager';

describe('doManager', () => {
  let actionListener, mutationListener, storeMock;
  const commit = jest.fn();

  beforeAll(() => {
    storeMock = {
      subscribeAction(fn) {
        actionListener = fn;
      },
      subscribe(fn) {
        mutationListener = fn;
      },
      commit,
      state: {
        scene: {
          d: 1
        }
      }
    };

    doM.doManagerPlugin(storeMock);
  });

  beforeEach(() => {
    doM.resetDoStack();
    commit.mockReset();
  });

  describe('doManagerPlugin', () => {
    it('should make undoable', () => {
      expect(doM.canUndo()).toBe(false);
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {}
      );
      expect(doM.canUndo()).toBe(true);
    });
  });

  describe('undo', () => {
    it('should just undo', () => {
      const state = {d: 2};

      actionListener(
        {
          type: 'scene/resetScene'
        },
        {
          scene: state
        }
      );

      doM.undo();
      expect(commit).toHaveBeenCalledWith('scene/resetScene', state);
    });
  });

  describe('redo', () => {
    it('should just redo', () => {
      const state = {d: 2};

      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: state
        }
      );

      doM.undo();
      doM.redo();
      expect(commit).toHaveBeenCalledWith('scene/resetScene', storeMock.state.scene);
    });

    it("shouldn't redo after new action coming", () => {
      const state = {d: 2};

      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: state
        }
      );

      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: state
        }
      );

      doM.undo();
      doM.undo();

      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: state
        }
      );

      expect(doM.canRedo()).toBe(false);
    });
  });

  describe('canUndo, canRedo state', () => {
    it('when undo stack has item then commit canUndo mutation with true', () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      expect(commit.mock.calls[0]).toEqual(['canUndo', true]);
    });

    it('when undo stack is empty then commit canUndo mutation with false', () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      commit.mockReset();

      doM.undo();

      expect(commit.mock.calls[0]).toEqual(['canUndo', false]);
    });

    it('when undo was invoked then commit canRedo with true', () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      commit.mockReset();

      doM.undo();

      expect(commit.mock.calls[1]).toEqual(['canRedo', true]);
    });

    it('when redo stack is empty then commit canRedo with false', () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      doM.undo();

      commit.mockReset();

      doM.redo();

      expect(commit.mock.calls[0]).toEqual(['canRedo', false]);
    });

    it('commit canRedo mutation with false when have redo stack and new action coming', () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      doM.undo();

      commit.mockReset();

      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      expect(commit.mock.calls[1]).toEqual(['canRedo', false]);
    });
  });
  describe('resetDoStack', () => {
    it('should be invoked when scene/resetScene mutation invoked', () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      doM.undo();

      mutationListener(
        {
          type: 'scene/resetScene'
        },
        {
          scene: {}
        }
      );

      expect(doM.canUndo()).toEqual(false);
      expect(doM.canRedo()).toEqual(false);
    });
    it("shouldn't be invoked when undo or redo invoked", () => {
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );
      actionListener(
        {
          type: 'scene/blahblah'
        },
        {
          scene: {}
        }
      );

      doM.undo();
      expect(doM.canUndo()).toEqual(true);
      expect(doM.canRedo()).toEqual(true);

      doM.redo();
      expect(doM.canUndo()).toEqual(true);
    });
  });
});
