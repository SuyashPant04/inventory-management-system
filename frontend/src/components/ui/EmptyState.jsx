function EmptyState({ icon = "📭", title = "No data found", message = "There are no items to display." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center max-w-sm">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
