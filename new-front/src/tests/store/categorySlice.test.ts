import categoryReducer, {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError
} from '../../store/slices/categorySlice';

describe('Category Slice', () => {
  const initialState = {
    categories: [],
    loading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(categoryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchCategories.pending', () => {
    const nextState = categoryReducer(initialState, fetchCategories.pending);
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('should handle fetchCategories.fulfilled', () => {
    const mockCategories = [
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transport' }
    ];
    const nextState = categoryReducer(
      initialState,
      fetchCategories.fulfilled({ categories: mockCategories }, 'requestId', undefined)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.categories).toEqual(mockCategories);
  });

  it('should handle fetchCategories.rejected', () => {
    const error = 'Failed to fetch categories';
    const nextState = categoryReducer(
      initialState,
      fetchCategories.rejected(new Error(error), 'requestId', undefined)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it('should handle createCategory.fulfilled', () => {
    const newCategory = { id: 3, name: 'Entertainment' };
    const nextState = categoryReducer(
      { ...initialState, categories: [{ id: 1, name: 'Food' }] },
      createCategory.fulfilled(newCategory, 'requestId', { name: 'Entertainment' })
    );
    expect(nextState.categories).toContainEqual(newCategory);
  });

  it('should handle updateCategory.fulfilled', () => {
    const updatedCategory = { id: 1, name: 'Updated Food' };
    const nextState = categoryReducer(
      { ...initialState, categories: [{ id: 1, name: 'Food' }] },
      updateCategory.fulfilled(updatedCategory, 'requestId', { id: 1, name: 'Updated Food' })
    );
    expect(nextState.categories).toContainEqual(updatedCategory);
  });

  it('should handle deleteCategory.fulfilled', () => {
    const nextState = categoryReducer(
      { ...initialState, categories: [{ id: 1, name: 'Food' }] },
      deleteCategory.fulfilled(1, 'requestId', 1)
    );
    expect(nextState.categories).not.toContainEqual({ id: 1, name: 'Food' });
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const nextState = categoryReducer(stateWithError, clearError());
    expect(nextState.error).toBe(null);
  });
}); 