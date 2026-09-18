import { NextRequest, NextResponse } from 'next/server';
import { queryCollegesFromDatabase } from '@/lib/collegeService';
import { FilterState } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const searchQuery = searchParams.get('q') || '';
  const states = searchParams.getAll('state');
  const streams = searchParams.getAll('stream');
  const types = searchParams.getAll('type');
  const ownership = searchParams.getAll('ownership');
  const naac = searchParams.getAll('naac');
  const sortBy = (searchParams.get('sort') || 'nirf') as FilterState['sortBy'];
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '24', 10);

  const filters: FilterState = {
    searchQuery,
    selectedStates: states,
    selectedStreams: streams,
    selectedTypes: types,
    selectedOwnership: ownership,
    selectedNaac: naac,
    sortBy,
    page,
    pageSize,
  };

  try {
    const result = await queryCollegesFromDatabase(filters);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to query colleges' },
      { status: 500 }
    );
  }
}

