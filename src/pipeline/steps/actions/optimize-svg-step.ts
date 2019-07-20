import * as Svgo from "svgo"
import StepBase from "../step-base"
import ActionStepBase from "./action-step-base"

const svgo = new Svgo({
  plugins: [{
    cleanupAttrs: true
  }, {
    inlineStyles: true
  } as any, {
    removeDoctype: true
  }, {
    removeXMLProcInst: true
  }, {
    removeComments: true
  }, {
    removeMetadata: true
  }, {
    removeTitle: true
  }, {
    removeDesc: true
  }, {
    removeUselessDefs: true
  }, {
    removeXMLNS: true
  }, {
    removeEditorsNSData: true
  }, {
    removeEmptyAttrs: true
  }, {
    removeHiddenElems: true
  }, {
    removeEmptyText: true
  }, {
    removeEmptyContainers: true
  }, {
    removeViewBox: true
  }, {
    cleanupEnableBackground: true
  }, {
    minifyStyles: true
  }, {
    convertStyleToAttrs: true
  }, {
    convertColors: true
  }, {
    convertPathData: {
      applyTransforms: true,
      applyTransformsStroked: true,
      makeArcs: {
        threshold: 2.5,
        tolerance: 0.5
      },
      straightCurves: true,
      lineShorthands: true,
      curveSmoothShorthands: true,
      floatPrecision: 0,
      transformPrecision: 5,
      removeUseless: true,
      collapseRepeated: true,
      utilizeAbsolute: true,
      leadingZero: true,
      negativeExtraSpace: true,
      noSpaceAfterFlags: true,
      forceAbsolutePath: false
    }
  }, {
    convertTransform: true
  }, {
    removeUnknownsAndDefaults: true
  }, {
    removeNonInheritableGroupAttrs: true
  }, {
    removeUselessStrokeAndFill: true
  }, {
    removeUnusedNS: true
  }, {
    cleanupIDs: true
  }, {
    cleanupNumericValues: true
  }, {
    cleanupListOfValues: true
  }, {
    moveElemsAttrsToGroup: true
  }, {
    moveGroupAttrsToElems: true
  }, {
    collapseGroups: true
  }, {
    removeRasterImages: true
  }, {
    mergePaths: true
  }, {
    convertShapeToPath: true
  }, {
    sortAttrs: true
  }, {
    removeDimensions: false
  }, {
    removeStyleElement: true
  }, {
    removeScriptElement: true
  }]
})

export default class OptimizeSvgStep extends ActionStepBase {
  constructor(
    private readonly getText: () => string,
    private readonly storeResult: (optimized: string) => void
  ) {
    super(
      `optimizeSvgStep`,
      [],
      (self: StepBase) => []
    )
  }


  async execute(): Promise<void> {
    this.storeResult((await svgo.optimize(this.getText())).data)
  }
}
