import { Injector } from "../src/index";

describe('Context', () => {
    it('UpdateExitingExtras_ReturnsNewValue', () => {
        const context = Injector.Create();
        const key = 'test';
        let value = new Object();

        context.setExtra(key, value);
        expect(context.getExtra(key)).toEqual(value);

        value = new Object();
        context.setExtra(key, value);
        expect(context.getExtra(key)).toEqual(value);
    });
    it('AddExtra_ReturnsTheAddedExtra', () => {
        const context = Injector.Create();
        const key = 'test';
        let value = new Object();

        context.setExtra(key, value);
        expect(context.getExtra(key)).toEqual(value);
    });
});
