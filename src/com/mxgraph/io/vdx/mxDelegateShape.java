package com.mxgraph.io.vdx;

import org.w3c.dom.Element;

/**
 * This class is a wrapper for a shape element.<br/>
 * Contains references to the stylesheets indicated in the shape.<br/>
 * If a property is not found in the shape Element but it may be found in a stylesheet,
 * the property is searched in such stylesheet.
 */
public class mxDelegateShape extends mxGeneralShape
{
	protected mxStyleSheet fillStyle = null;

	protected mxStyleSheet lineStyle = null;

	protected mxStyleSheet textStyle = null;

	public mxDelegateShape(Element s)
	{
		super(s);
		mxStyleSheetManager ssm = mxStyleSheetManager.getInstance();
		this.fillStyle = ssm.getSheet(getFillStyleId());
		this.lineStyle = ssm.getSheet(getLineStyleId());
		this.textStyle = ssm.getSheet(getTextStyleId());
	}

	@Override
	public String getFillColor()
	{
		String color = "";
		boolean has = super.hasFillColor();
		if (has)
		{
			color = super.getFillColor();
		}
		else if (fillStyle != null)
		{
			color = fillStyle.getFillColor();
		}
		return color;
	}

	@Override
	public String getFillForeColor()
	{
		String color = "";
		boolean has = super.hasFillForeColor();
		if (has)
		{
			color = super.getFillForeColor();
		}
		else if (fillStyle != null)
		{
			color = fillStyle.getFillForeColor();
		}
		return color;
	}

	@Override
	public String getFillPattern()
	{
		String color = "";
		boolean has = super.hasFillPattern();
		if (has)
		{
			color = super.getFillPattern();
		}
		else if (fillStyle != null)
		{
			color = fillStyle.getFillPattern();
		}
		return color;
	}

	@Override
	public boolean hasFillColor()
	{
		boolean has = super.hasFillColor();
		if ((fillStyle != null) && !has)
		{
			has = fillStyle.hasFillColor();
		}
		return has;
	}

	@Override
	public boolean hasFillForeColor()
	{
		boolean has = super.hasFillForeColor();
		if ((fillStyle != null) && !has)
		{
			has = fillStyle.hasFillForeColor();
		}
		return has;
	}

	@Override
	public boolean hasFillPattern()
	{
		boolean has = super.hasFillPattern();
		if ((fillStyle != null) && !has)
		{
			has = fillStyle.hasFillPattern();
		}
		return has;
	}

	@Override
	public double getTransparence()
	{
		double trans = 0;
		boolean has = super.hasTransparence();
		if (has)
		{
			trans = super.getTransparence();
		}
		else if (fillStyle != null)
		{
			trans = fillStyle.getTransparence();
		}
		return trans;
	}

	@Override
	public boolean hasTransparence()
	{
		boolean has = super.hasTransparence();
		if ((fillStyle != null) && !has)
		{
			has = fillStyle.hasTransparence();
		}
		return has;
	}

	@Override
	public String getLinePattern()
	{
		String pattern = "";
		boolean has = super.hasLinePattern();
		if (has)
		{
			pattern = super.getLinePattern();
		}
		else if (lineStyle != null)
		{
			pattern = lineStyle.getLinePattern();
		}
		return pattern;
	}

	@Override
	public boolean hasLinePattern()
	{
		boolean has = super.hasLinePattern();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasLinePattern();
		}
		return has;
	}

	@Override
	public String getBeginArrow()
	{
		String begin = "";
		boolean has = super.hasBeginArrow();
		if (has)
		{
			begin = super.getBeginArrow();
		}
		else if (lineStyle != null)
		{
			begin = lineStyle.getBeginArrow();
		}
		return begin;
	}

	@Override
	public String getEndArrow()
	{
		String end = "";
		boolean has = super.hasEndArrow();
		if (has)
		{
			end = super.getEndArrow();
		}
		else if (lineStyle != null)
		{
			end = lineStyle.getEndArrow();
		}
		return end;
	}

	@Override
	public boolean hasBeginArrow()
	{
		boolean has = super.hasBeginArrow();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasBeginArrow();
		}
		return has;
	}

	@Override
	public boolean hasEndArrow()
	{
		boolean has = super.hasEndArrow();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasEndArrow();
		}
		return has;
	}

	@Override
	public boolean hasLineColor()
	{
		boolean has = super.hasLineColor();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasLineColor();
		}
		return has;
	}

	@Override
	public String getLineColor()
	{
		String color = "";
		boolean has = super.hasLineColor();
		if (has)
		{
			color = super.getLineColor();
		}
		else if (lineStyle != null)
		{
			color = lineStyle.getLineColor();
		}
		return color;
	}

	@Override
	public String getBeginArrowSize()
	{
		String size = "";
		boolean has = super.hasBeginArrowSize();
		if (has)
		{
			size = super.getBeginArrowSize();
		}
		else if (lineStyle != null)
		{
			size = lineStyle.getBeginArrowSize();
		}
		return size;
	}

	@Override
	public String getEndArrowSize()
	{
		String size = "";
		boolean has = super.hasEndArrowSize();
		if (has)
		{
			size = super.getEndArrowSize();
		}
		else if (lineStyle != null)
		{
			size = lineStyle.getEndArrowSize();
		}
		return size;
	}

	@Override
	public boolean hasBeginArrowSize()
	{
		boolean has = super.hasBeginArrowSize();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasBeginArrowSize();
		}
		return has;
	}

	@Override
	public boolean hasEndArrowSize()
	{
		boolean has = super.hasEndArrowSize();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasEndArrowSize();
		}
		return has;
	}

	@Override
	public double getLineWeight()
	{
		double weight = 0;
		boolean has = super.hasLineWeight();
		if (has)
		{
			weight = super.getLineWeight();
		}
		else if (lineStyle != null)
		{
			weight = lineStyle.getLineWeight();
		}
		return weight;
	}

	@Override
	public boolean hasLineWeight()
	{
		boolean has = super.hasLineWeight();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasLineWeight();
		}
		return has;
	}

	@Override
	public double getRounding()
	{
		double round = 0;
		boolean has = super.hasRounding();
		if (has)
		{
			round = super.getRounding();
		}
		else if (lineStyle != null)
		{
			round = lineStyle.getRounding();
		}
		return round;
	}

	@Override
	public String getShdwPattern()
	{
		String shdwPat = "0";
		boolean has = super.hasShdwPattern();
		if (has)
		{
			shdwPat = super.getShdwPattern();
		}
		else if (lineStyle != null)
		{
			shdwPat = lineStyle.getShdwPattern();
		}
		return shdwPat;
	}

	@Override
	public boolean hasRounding()
	{
		boolean has = super.hasRounding();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasRounding();
		}
		return has;
	}

	@Override
	public boolean hasShdwPattern()
	{
		boolean has = super.hasShdwPattern();
		if ((lineStyle != null) && !has)
		{
			has = lineStyle.hasShdwPattern();
		}
		return has;
	}

	@Override
	public String getTextColor(String charIX)
	{
		String color = "#000000";
		boolean has = super.hasTextColor(charIX);
		if (has)
		{
			color = super.getTextColor(charIX);
		}
		else if (textStyle != null)
		{
			color = textStyle.getTextColor(charIX);
		}
		return color;
	}

	@Override
	public boolean hasTextColor(String charIX)
	{
		boolean has = super.hasTextColor(charIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextColor(charIX);
		}
		return has;
	}

	@Override
	public String getTextFont(String charIX)
	{
		String font = "";
		boolean has = super.hasTextFont(charIX);
		if (has)
		{
			font = super.getTextFont(charIX);
		}
		else if (textStyle != null)
		{
			font = textStyle.getTextFont(charIX);
		}
		return font;
	}

	@Override
	public String getTextSize(String charIX)
	{
		String size = "";
		boolean has = super.hasTextSize(charIX);
		if (has)
		{
			size = super.getTextSize(charIX);
		}
		else if (textStyle != null)
		{
			size = textStyle.getTextSize(charIX);
		}
		return size;
	}

	@Override
	public boolean hasTextFont(String charIX)
	{
		boolean has = super.hasTextFont(charIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextFont(charIX);
		}
		return has;
	}

	@Override
	public boolean hasTextSize(String charIX)
	{
		boolean has = super.hasTextSize(charIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextSize(charIX);
		}
		return has;
	}

	@Override
	public String getTextBkgndColor()
	{
		String size = "";
		boolean has = super.hasTextBkgndColor();
		if (has)
		{
			size = super.getTextBkgndColor();
		}
		else if (textStyle != null)
		{
			size = textStyle.getTextBkgndColor();
		}
		return size;
	}

	@Override
	public int getTextPos(String charIX)
	{
		int pos = 0;
		boolean has = super.hasTextPos(charIX);
		if (has)
		{
			pos = super.getTextPos(charIX);
		}
		else if (textStyle != null)
		{
			pos = textStyle.getTextPos(charIX);
		}
		return pos;
	}

	@Override
	public boolean getTextStrike(String charIX)
	{
		boolean strike = false;
		boolean has = super.hasTextStrike(charIX);
		if (has)
		{
			strike = super.getTextStrike(charIX);
		}
		else if (textStyle != null)
		{
			strike = textStyle.getTextStrike(charIX);
		}
		return strike;
	}

	@Override
	public String getTextStyle(String charIX)
	{
		String size = "";
		boolean has = super.hasTextStyle(charIX);
		if (has)
		{
			size = super.getTextStyle(charIX);
		}
		else if (textStyle != null)
		{
			size = textStyle.getTextStyle(charIX);
		}
		return size;
	}

	@Override
	public boolean hasTextBkgndColor()
	{
		boolean has = super.hasTextBkgndColor();
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextBkgndColor();
		}
		return has;
	}

	@Override
	public boolean hasTextPos(String charIX)
	{
		boolean has = super.hasTextPos(charIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextPos(charIX);
		}
		return has;
	}

	@Override
	public boolean hasTextStrike(String charIX)
	{
		boolean has = super.hasTextPos(charIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextPos(charIX);
		}
		return has;
	}

	@Override
	public boolean hasTextStyle(String charIX)
	{
		boolean has = super.hasTextStyle(charIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextStyle(charIX);
		}
		return has;
	}

	@Override
	public double getTextBottomMargin()
	{
		double margin = 0;
		boolean has = super.hasTextBottomMargin();
		if (has)
		{
			margin = super.getTextBottomMargin();
		}
		else if (textStyle != null)
		{
			margin = textStyle.getTextBottomMargin();
		}
		return margin;
	}

	@Override
	public double getTextLeftMargin()
	{
		double margin = 0;
		boolean has = super.hasTextLeftMargin();
		if (has)
		{
			margin = super.getTextLeftMargin();
		}
		else if (textStyle != null)
		{
			margin = textStyle.getTextLeftMargin();
		}
		return margin;
	}

	@Override
	public double getTextRightMargin()
	{
		double margin = 0;
		boolean has = super.hasTextRightMargin();
		if (has)
		{
			margin = super.getTextRightMargin();
		}
		else if (textStyle != null)
		{
			margin = textStyle.getTextRightMargin();
		}
		return margin;
	}

	@Override
	public double getTextTopMargin()
	{
		double margin = 0;
		boolean has = super.hasTextTopMargin();
		if (has)
		{
			margin = super.getTextTopMargin();
		}
		else if (textStyle != null)
		{
			margin = textStyle.getTextTopMargin();
		}
		return margin;
	}

	@Override
	public boolean hasTextBottomMargin()
	{
		boolean has = super.hasTextBottomMargin();
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextBottomMargin();
		}
		return has;
	}

	@Override
	public boolean hasTextLeftMargin()
	{
		boolean has = super.hasTextLeftMargin();
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextLeftMargin();
		}
		return has;
	}

	@Override
	public boolean hasTextRightMargin()
	{
		boolean has = super.hasTextRightMargin();
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextRightMargin();
		}
		return has;
	}

	@Override
	public boolean hasTextTopMargin()
	{
		boolean has = super.hasTextTopMargin();
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasTextTopMargin();
		}
		return has;
	}

	@Override
	public int getVerticalAlign()
	{
		int align = 0;
		boolean has = super.hasVerticalAlign();
		if (has)
		{
			align = super.getVerticalAlign();
		}
		else if (textStyle != null)
		{
			align = textStyle.getVerticalAlign();
		}
		return align;
	}

	@Override
	public boolean hasVerticalAlign()
	{
		boolean has = super.hasVerticalAlign();
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasVerticalAlign();
		}
		return has;
	}

	@Override
	public int getHorizontalAlign(String paraIX)
	{
		int align = 0;
		boolean has = super.hasHorizontalAlign(paraIX);
		if (has)
		{
			align = super.getHorizontalAlign(paraIX);
		}
		else if (textStyle != null)
		{
			align = textStyle.getHorizontalAlign(paraIX);
		}
		return align;
	}

	@Override
	public String getIndentFirst(String paraIX)
	{
		String indent = "0";
		boolean has = super.hasIndentFirst(paraIX);
		if (has)
		{
			indent = super.getIndentFirst(paraIX);
		}
		else if (textStyle != null)
		{
			indent = textStyle.getIndentFirst(paraIX);
		}
		return indent;
	}

	@Override
	public boolean hasHorizontalAlign(String paraIX)
	{
		boolean has = super.hasHorizontalAlign(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasHorizontalAlign(paraIX);
		}
		return has;
	}

	@Override
	public boolean hasIndentFirst(String paraIX)
	{
		boolean has = super.hasHorizontalAlign(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasHorizontalAlign(paraIX);
		}
		return has;
	}

	@Override
	public String getIndentLeft(String paraIX)
	{
		String indent = "0";
		boolean has = super.hasIndentLeft(paraIX);
		if (has)
		{
			indent = super.getIndentLeft(paraIX);
		}
		else if (textStyle != null)
		{
			indent = textStyle.getIndentLeft(paraIX);
		}
		return indent;
	}

	@Override
	public boolean hasIndentLeft(String paraIX)
	{
		boolean has = super.hasIndentLeft(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasIndentLeft(paraIX);
		}
		return has;
	}

	@Override
	public String getIndentRight(String paraIX)
	{
		String indent = "0";
		boolean has = super.hasIndentRight(paraIX);
		if (has)
		{
			indent = super.getIndentRight(paraIX);
		}
		else if (textStyle != null)
		{
			indent = textStyle.getIndentRight(paraIX);
		}
		return indent;
	}

	@Override
	public boolean hasIndentRight(String paraIX)
	{
		boolean has = super.hasIndentRight(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasIndentRight(paraIX);
		}
		return has;
	}

	@Override
	public String getSpAfter(String paraIX)
	{
		String space = "0";
		boolean has = super.hasSpAfter(paraIX);
		if (has)
		{
			space = super.getSpAfter(paraIX);
		}
		else if (textStyle != null)
		{
			space = textStyle.getSpAfter(paraIX);
		}
		return space;
	}

	@Override
	public String getSpBefore(String paraIX)
	{
		String space = "0";
		boolean has = super.hasSpBefore(paraIX);
		if (has)
		{
			space = super.getSpBefore(paraIX);
		}
		else if (textStyle != null)
		{
			space = textStyle.getSpBefore(paraIX);
		}
		return space;
	}

	@Override
	public boolean hasSpAfter(String paraIX)
	{
		boolean has = super.hasSpAfter(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasSpAfter(paraIX);
		}
		return has;
	}

	@Override
	public boolean hasSpBefore(String paraIX)
	{
		boolean has = super.hasSpBefore(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasSpBefore(paraIX);
		}
		return has;
	}

	@Override
	public double getSpLine(String paraIX)
	{
		double space = 0;
		boolean has = super.hasSpLine(paraIX);
		if (has)
		{
			space = super.getSpLine(paraIX);
		}
		else if (textStyle != null)
		{
			space = textStyle.getSpLine(paraIX);
		}
		return space;
	}

	@Override
	public boolean hasSpLine(String paraIX)
	{
		boolean has = super.hasSpLine(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasSpLine(paraIX);
		}
		return has;
	}

	@Override
	public String getRTLText(String paraIX)
	{
		String direction = "ltr";
		boolean has = super.hasRTLText(paraIX);
		if (has)
		{
			direction = super.getRTLText(paraIX);
		}
		else if (textStyle != null)
		{
			direction = textStyle.getRTLText(paraIX);
		}
		return direction;
	}

	@Override
	public boolean hasRTLText(String paraIX)
	{
		boolean has = super.hasRTLText(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasRTLText(paraIX);
		}
		return has;
	}

	@Override
	public String getFlags(String paraIX)
	{
		String direction = "ltr";
		boolean has = super.hasFlags(paraIX);
		if (has)
		{
			direction = super.getFlags(paraIX);
		}
		else if (textStyle != null)
		{
			direction = textStyle.getFlags(paraIX);
		}
		return direction;
	}

	@Override
	public boolean hasFlags(String paraIX)
	{
		boolean has = super.hasFlags(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasFlags(paraIX);
		}
		return has;
	}

	@Override
	public String getLetterSpace(String paraIX)
	{
		String space = "";
		boolean has = super.hasLetterSpace(paraIX);
		if (has)
		{
			space = super.getLetterSpace(paraIX);
		}
		else if (textStyle != null)
		{
			space = textStyle.getLetterSpace(paraIX);
		}
		return space;
	}

	@Override
	public boolean hasLetterSpace(String paraIX)
	{
		boolean has = super.hasLetterSpace(paraIX);
		if ((textStyle != null) && !has)
		{
			has = textStyle.hasLetterSpace(paraIX);
		}
		return has;
	}
}
