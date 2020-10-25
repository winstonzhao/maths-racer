import { Tester, createTester } from "./tester";

// This default export determines where your story goes in the story list
export default {
  title: "YourComponent",
  component: Tester,
};

const Template = () => {
  return createTester();
};

export const FirstStory = Template.bind({});
