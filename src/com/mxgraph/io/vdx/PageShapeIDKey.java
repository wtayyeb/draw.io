package com.mxgraph.io.vdx;

/**
 * Represents a key with the shape ID corresponding to a particular page.<br/>
 * This class is used like key in the maps present in mxVdxCodec.
 */
public class PageShapeIDKey
{
	private int pageNumber;

	private String ID;

	public PageShapeIDKey(int pageNumber, String ID)
	{
		this.pageNumber = pageNumber;
		this.ID = ID;
	}

	public String getID()
	{
		return ID;
	}

	public void setID(String ID)
	{
		this.ID = ID;
	}

	public int getPageNumber()
	{
		return pageNumber;
	}

	public void setPageNumber(int pageNumber)
	{
		this.pageNumber = pageNumber;
	}

	@Override
	public boolean equals(Object obj)
	{
		if (obj == null)
		{
			return false;
		}
		if (getClass() != obj.getClass())
		{
			return false;
		}
		final PageShapeIDKey other = (PageShapeIDKey) obj;
		if (this.pageNumber != other.pageNumber)
		{
			return false;
		}
		if ((this.ID == null) ? (other.ID != null) : !this.ID.equals(other.ID))
		{
			return false;
		}
		return true;
	}

	@Override
	public int hashCode()
	{
		int hash = 7;
		hash = 83 * hash + this.pageNumber;
		hash = 83 * hash + (this.ID != null ? this.ID.hashCode() : 0);
		return hash;
	}
}
