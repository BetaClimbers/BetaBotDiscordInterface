import { Grade } from "../../src/commands/Grade";

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
class G extends Grade {}

// TODO: Write proper tests
test("when the command is executed, it will reply to the interaction", () => {
  const g = new G();
  g.grade("7a", undefined, undefined, new MockCommandInteraction());
  expect(mockReply).toHaveBeenCalledTimes(1);
});
