import { Credits } from "../../src/commands/Credits";

const mockReply = jest.fn();
const MockCommandInteraction = jest.fn().mockImplementation(() => {
  return {
    reply: mockReply,
    user: {
      username: "TestUser",
      discriminator: "4269",
    },
  };
});

class C extends Credits {}

test("when the command is executed, it will reply to the interaction", () => {
  const c = new C();
  c.credits(new MockCommandInteraction());
  expect(mockReply).toHaveBeenCalledTimes(1);
});
