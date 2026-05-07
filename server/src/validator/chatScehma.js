import { z } from "zod"
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Setup DOMPurify with JSDOM
const window =  new JSDOM("").window;
const purify = DOMPurify(window);

// Helper function to sanitize strings
const clean = (val) => purify.sanitize(val.trim());

export