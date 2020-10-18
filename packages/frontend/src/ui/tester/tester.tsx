import React from "react";
import { makeAutoObservable, action } from "mobx";
import { observer } from "mobx-react";
import {
  getRandomOperation,
  generateQuestion,
  generateDisplayString,
  Operation
} from "common/lib/lib";
import "./tester.scss";

export class TesterStore {
  displayString = "";
  firstNumber = 0;
  secondNumber = 0;
  score = 0;
  answer = 0;
  correct = false;

  constructor() {
    makeAutoObservable(this);
    this.getNewQuestion();
  }

  getNewQuestion() {
    ++this.score;

    const operation = getRandomOperation();

    let max1 = 99;
    let max2 = 10;
    let min1 = 1;
    let min2 = 1;

    if (operation === Operation.Divide || operation === Operation.Multiply) {
      max1 = 99;
      max2 = 10;
      min1 = 1;
      min2 = 1;
    } else {
      max1 = 99;
      max2 = 90;
      min1 = 10;
      min2 = 10;
    }

    const [firstNumber, secondNumber, answer] = generateQuestion(
      operation,
      max1,
      min1,
      max2,
      min2
    );
    this.firstNumber = firstNumber;
    this.secondNumber = secondNumber;
    this.answer = answer;
    this.displayString = generateDisplayString(
      firstNumber,
      secondNumber,
      operation
    );
  }
}

export const Tester = observer(({ store }: { store: TesterStore }) => {
  return (
    <div className="tester_container">
      <div
        key={store.score}
        className="tester_score_container animate__animated animate__heartBeat"
      >
        <p className="tester_score ">{store.score}</p>
      </div>
      <h1
        key={store.displayString}
        className="tester_question_header animate__animated animate__bounceIn"
      >
        {store.displayString}
      </h1>
      <div className="tester_input_wrapper">
        <input
          onChange={(e) => {
            if (parseInt(e.target.value) === store.answer) {
              store.getNewQuestion();
              e.target.value = "";
            }
          }}
        ></input>
        <div className="tester_input_line"></div>
      </div>
    </div>
  );
});

export const createTester = () => {
  const store = new TesterStore();
  return <Tester store={store}></Tester>;
};
