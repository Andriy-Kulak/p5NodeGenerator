/**
 * /* eslint-disable max-len
 *
 * @format
 */

/** @format */
/* eslint-disable require-jsdoc */

const p5 = require('node-p5');
const fs = require('fs');

// initialize all constants
const side = 1440;
const numSlices = getRandomIntRange(3, 8);
const slice = side / numSlices;
const circleSize = side / (numSlices + 1);
const randomLimit = 100000;
const subCircles = 5;
const strokeWidth = Math.floor(circleSize / subCircles / numSlices) + numSlices;
const dir = 'images/';
const canvasName = getRandomIntRange(0, randomLimit).toString();
let leftHue;
let rightHue;
const gcsPrefix = 'https://storage.googleapis.com/';

// parse config file
function parseConfig() {
  const rawdata = fs.readFileSync('config.json');
  const config = JSON.parse(rawdata);
  return config;
}

// helper function for random integer generation
function getRandomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// create image
function sketch(p) {
  p.setup = () => {
    const canvas = p.createCanvas(side, side);
    leftHue = p.random(360);
    rightHue = (leftHue + 180) % 360;
    p.colorMode(p.HSB);
    p.background(rightHue, getRandomIntRange(0, 75), 100);
    p.strokeWeight(strokeWidth);
    p.strokeCap(p.SQUARE);
    p.noLoop();
    p.angleMode(p.DEGREES);
    p.fill(0, 0, 0, 0);
    setTimeout(() => {
      p.saveCanvas(canvas, dir.concat(canvasName), 'jpg').then(
        (filePath) => {}
      );
    }, 100);
  };
  p.draw = () => {
    for (let i = 0; i < numSlices + 1; i++) {
      for (let j = 0; j < numSlices + 1; j++) {
        for (let x = 0; x < subCircles; x++) {
          p.stroke(
            leftHue,
            getRandomIntRange(50, 75),
            getRandomIntRange(75, 100)
          );
          if (Math.floor(p.random(3)) == 0) {
            randomArcStart = getRandomIntRange(0, 90);
            randomArcStop = randomArcStart - getRandomIntRange(45, 180);
            p.arc(
              i * slice,
              j * slice,
              circleSize - (x * circleSize) / subCircles,
              circleSize - (x * circleSize) / subCircles,
              randomArcStart,
              randomArcStop
            );
          } else if (Math.floor(p.random(3)) == 1) {
            p.circle(
              i * slice,
              j * slice,
              circleSize - (x * circleSize) / subCircles
            );
          }
        }
      }
    }
  };
}

p5.createSketch(sketch);
